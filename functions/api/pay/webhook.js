import { json, fail } from '../../_lib/http.js';
import { nylon, syncByReference } from '../../_lib/nylon.js';

// POST /api/pay/webhook: Nylon Pay delivery. Signature is checked on the RAW body, then the payment is
// re-confirmed with Nylon Pay's status API, so a forged or replayed body can never mark money as received.
export async function onRequestPost({ env, request }) {
  if (!env.NYLONPAY_WEBHOOK_SECRET) fail('Webhook is not configured.', 503);
  const raw = await request.text();
  const signature = request.headers.get('x-nylon-signature') || '';
  let valid = false;
  try { valid = nylon(env).verifyWebhookSignature({ payload: raw, signature, secret: env.NYLONPAY_WEBHOOK_SECRET }); } catch { valid = false; }
  if (!valid) fail('Invalid signature', 401);

  let body = {};
  try { body = JSON.parse(raw); } catch { /* no reference found below */ }
  const ref = body.reference ?? body.transaction?.reference ?? body.data?.reference ?? body.data?.transaction?.reference;
  if (typeof ref === 'string' && /^[a-f0-9]{14}$/.test(ref)) await syncByReference(env, ref);
  return json({ received: true });
}
