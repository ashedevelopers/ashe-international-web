import { json, fail, readBody } from '../../_lib/http.js';
import { requireRole } from '../../_lib/auth.js';
import { nstr } from '../../_lib/fields.js';
import { isUuid } from '../../_lib/util.js';

// PATCH /api/project_milestones/:id (admin)
export async function onRequestPatch(ctx) {
  await requireRole(ctx, 'admin');
  if (!isUuid(ctx.params.id)) fail('Not found', 404);
  const b = await readBody(ctx.request);
  const sets = [];
  const binds = [];
  if (['pending', 'active', 'completed'].includes(b.status)) { sets.push('status = ?'); binds.push(b.status); }
  for (const f of ['title', 'description']) if (b[f] !== undefined) { sets.push(`${f} = ?`); binds.push(nstr(b[f])); }
  if (!sets.length) return json({ updated: false });
  await ctx.env.DB.prepare(`UPDATE project_milestones SET ${sets.join(', ')} WHERE id = ?`).bind(...binds, ctx.params.id).run();
  return json({ updated: true });
}
