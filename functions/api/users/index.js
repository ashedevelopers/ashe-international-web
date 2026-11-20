import { json } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';
import { params } from '../../_lib/util.js';

// GET /api/users?q= (admin)
export async function onRequestGet(ctx) {
  await requireAdmin(ctx);
  const q = (params(ctx.request).get('q') || '').trim();
  let sql = 'SELECT u.id, u.email, u.is_active, u.created_at, p.display_name, (SELECT GROUP_CONCAT(role) FROM user_roles r WHERE r.user_id = u.id) AS roles FROM users u LEFT JOIN profiles p ON p.user_id = u.id';
  const binds = [];
  if (q) { sql += ' WHERE u.email LIKE ? OR p.display_name LIKE ?'; binds.push(`%${q}%`, `%${q}%`); }
  const { results } = await ctx.env.DB.prepare(`${sql} ORDER BY u.created_at DESC LIMIT 300`).bind(...binds).all();
  return json(results.map((r) => ({ ...r, roles: r.roles ? r.roles.split(',') : [] })));
}
