import { createNylonPay } from '@nile-squad/nylonpay-ts';
import { fail } from './http.js';
import { completeDonation } from './donations.js';

const OK = ['success', 'successful', 'completed', 'paid', 'succeeded'];
const BAD = ['failed', 'cancelled', 'canceled', 'expired', 'rejected', 'declined', 'error'];

// Nylon Pay client (server-side only). Keys are Cloudflare secrets; never expose them to the browser.
export function nylon(env) {
  if (!env.NYLONPAY_API_KEY || !env.NYLONPAY_API_SECRET) fail('Online payments are not configured yet.', 503);
  return createNylonPay({ apiKey: env.NYLONPAY_API_KEY, apiSecret: env.NYLONPAY_API_SECRET });
}

export const mapStatus = (s) => {
  const v = String(s || '').toLowerCase();
  return OK.includes(v) ? 'completed' : BAD.includes(v) ? 'failed' : 'pending';
};

// Source of truth is Nylon Pay's own status for the reference, never the webhook body or the browser.
// Returns 'completed' | 'failed' | 'pending', or null if the reference is unknown.
export async function syncByReference(env, reference) {
  const d = await env.DB.prepare("SELECT id, status FROM donations WHERE tracking_id = ? AND payment_provider = 'nylonpay'").bind(reference).first();
  if (!d) return null;
  if (d.status !== 'pending') return d.status;
  const r = await nylon(env).getStatus({ reference });
  if (!r.isOk) return 'pending';
  const s = mapStatus(r.value?.status);
  if (s === 'completed') await completeDonation(env, d.id, reference);
  else if (s === 'failed') await env.DB.prepare("UPDATE donations SET status = 'failed' WHERE id = ? AND status = 'pending'").bind(d.id).run();
  return s;
}
