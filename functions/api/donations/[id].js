import { json, fail, readBody, san } from '../../_lib/http.js';
import { requireRole } from '../../_lib/auth.js';
import { completeDonation } from '../../_lib/donations.js';
import { isUuid } from '../../_lib/util.js';

const STATUSES = ['pending', 'completed', 'failed', 'refunded'];

// PATCH /api/donations/:id (admin/finance)
export async function onRequestPatch(ctx) {
  const { env, params, request } = ctx;
  await requireRole(ctx, 'admin', 'finance');
  if (!isUuid(params.id)) fail('Not found', 404);
  const b = await readBody(request);
  if (b.status !== undefined) {
    const status = san(String(b.status));
    if (!STATUSES.includes(status)) fail('Invalid status');
    if (status === 'completed') await completeDonation(env, params.id, san(String(b.payment_reference || '')) || null);
    else await env.DB.prepare('UPDATE donations SET status = ? WHERE id = ?').bind(status, params.id).run();
  } else if (b.payment_reference !== undefined) {
    await env.DB.prepare('UPDATE donations SET payment_reference = ? WHERE id = ?').bind(san(String(b.payment_reference)), params.id).run();
  }
  return json({ updated: true });
}
