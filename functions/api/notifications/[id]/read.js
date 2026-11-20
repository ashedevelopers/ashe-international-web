import { json, fail } from '../../../_lib/http.js';
import { requireAdmin } from '../../../_lib/auth.js';
import { isUuid } from '../../../_lib/util.js';

// PATCH /api/notifications/:id/read (admin)
export async function onRequestPatch(ctx) {
  await requireAdmin(ctx);
  if (!isUuid(ctx.params.id)) fail('Not found', 404);
  await ctx.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').bind(ctx.params.id).run();
  return json({ updated: true });
}
