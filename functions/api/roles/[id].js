import { json, fail } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';

// DELETE /api/roles/:id (admin). The last administrator can never be removed.
export async function onRequestDelete(ctx) {
  const { env, params } = ctx;
  await requireAdmin(ctx);
  const r = await env.DB.prepare('SELECT user_id, role FROM user_roles WHERE id = ?').bind(params.id).first();
  if (r && r.role === 'admin') {
    const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM user_roles WHERE role = 'admin'").first();
    if (n <= 1) fail('You cannot remove the last administrator.');
  }
  await env.DB.prepare('DELETE FROM user_roles WHERE id = ?').bind(params.id).run();
  return json({ deleted: true });
}
