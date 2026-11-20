import { json, fail, readBody, required, san } from '../../_lib/http.js';
import { requireRole } from '../../_lib/auth.js';
import { isUuid } from '../../_lib/util.js';

// PATCH /api/withdrawals/:id (admin/finance): approve, reject or mark paid.
export async function onRequestPatch(ctx) {
  const { env, params, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'finance');
  if (!isUuid(params.id)) fail('Not found', 404);
  const status = san(String(required(await readBody(request), 'status')));
  if (!['approved', 'rejected', 'paid'].includes(status)) fail('Invalid status');
  await env.DB.prepare('UPDATE withdrawal_requests SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, u.sub, params.id).run();
  return json({ updated: true });
}
