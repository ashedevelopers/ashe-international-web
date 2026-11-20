import { json, fail, readBody, san } from '../../_lib/http.js';
import { currentUser, requireAdmin, hasRole } from '../../_lib/auth.js';
import { isUuid, toFlag, sqlTime } from '../../_lib/util.js';

const STATUSES = ['draft', 'pending', 'active', 'funded', 'closed'];

export function visible(p, u) {
  if (hasRole(u, 'admin', 'designer')) return true;
  if (u && p.owner_id === u.sub) return true;
  return ['active', 'funded'].includes(p.status) && !p.is_suspended;
}

// GET /api/projects/:id
export async function onRequestGet(ctx) {
  const { env, params } = ctx;
  if (!isUuid(params.id)) fail('Not found', 404);
  const p = await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(params.id).first();
  if (!p || !visible(p, await currentUser(ctx, false))) fail('Not found', 404);
  return json(p);
}

// PATCH /api/projects/:id: staff edit anything; owners edit their own draft/pending campaigns only.
export async function onRequestPatch(ctx) {
  const { env, params, request } = ctx;
  if (!isUuid(params.id)) fail('Not found', 404);
  const u = await currentUser(ctx);
  const staff = hasRole(u, 'admin', 'designer');
  const p = await env.DB.prepare('SELECT owner_id, status FROM projects WHERE id = ?').bind(params.id).first();
  if (!p) fail('Not found', 404);
  const isOwner = p.owner_id === u.sub;
  if (!staff && !(isOwner && ['draft', 'pending'].includes(p.status))) fail('Forbidden', 403);

  const b = await readBody(request);
  const text = ['title', 'category', 'location', 'story', 'image_url', 'signed_consent_url'];
  let flags = [];
  if (staff) { text.push('status'); flags = ['is_promoted', 'is_staff_pick', 'is_loved', 'is_suspended']; }
  const sets = [];
  const binds = [];
  for (const f of text) {
    if (!(f in b)) continue;
    const val = san(String(b[f] ?? ''));
    if (f === 'status' && !STATUSES.includes(val)) fail('Invalid status');
    sets.push(`${f} = ?`); binds.push(val === '' ? null : val);
  }
  if ('goal_amount' in b) { sets.push('goal_amount = ?'); binds.push(Math.max(0, Number(b.goal_amount) || 0)); }
  if ('consent_signed_at' in b) { sets.push('consent_signed_at = ?'); binds.push(sqlTime(b.consent_signed_at)); }
  for (const f of flags) {
    if (!(f in b)) continue;
    sets.push(`${f} = ?`); binds.push(toFlag(b[f]));
  }
  if (!sets.length) return json({ updated: false });
  await env.DB.prepare(`UPDATE projects SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(...binds, params.id).run();
  return json(await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(params.id).first());
}

// DELETE /api/projects/:id (admin)
export async function onRequestDelete(ctx) {
  const { env, params } = ctx;
  await requireAdmin(ctx);
  if (!isUuid(params.id)) fail('Not found', 404);
  await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(params.id).run();
  return json({ deleted: true });
}
