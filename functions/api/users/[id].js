import { json, fail, readBody } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';
import { isUuid, toFlag } from '../../_lib/util.js';

// PATCH /api/users/:id (admin): activate or deactivate an account.
export async function onRequestPatch(ctx) {
  const me = await requireAdmin(ctx);
  const { id } = ctx.params;
  if (!isUuid(id)) fail('Not found', 404);
  const b = await readBody(ctx.request);
  if ('is_active' in b) {
    if (id === me.sub) fail('You cannot deactivate your own account.');
    await ctx.env.DB.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(toFlag(b.is_active), id).run();
  }
  return json({ updated: true });
}
