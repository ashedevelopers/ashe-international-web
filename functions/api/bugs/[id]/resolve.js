import { json, fail } from '../../../_lib/http.js';
import { requireRole } from '../../../_lib/auth.js';
import { isUuid } from '../../../_lib/util.js';

// PATCH /api/bugs/:id/resolve (admin)
export async function onRequestPatch(ctx) {
  const u = await requireRole(ctx, 'admin');
  if (!isUuid(ctx.params.id)) fail('Not found', 404);
  await ctx.env.DB.prepare("UPDATE bug_reports SET is_resolved = 1, status = 'resolved', resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?").bind(u.sub, ctx.params.id).run();
  return json({ updated: true });
}
