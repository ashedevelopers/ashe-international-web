import { json, fail, readBody, san } from '../../_lib/http.js';
import { currentUser, hasRole } from '../../_lib/auth.js';
import { rateLimit } from '../../_lib/ratelimit.js';
import { createDonationRow } from '../../_lib/donations.js';
import { params, clampInt, isUuid } from '../../_lib/util.js';

// GET /api/donations: admin/finance see everything (filterable); the public only gets one campaign's
// completed donations, with emails removed and anonymous donor names hidden.
export async function onRequestGet(ctx) {
  const { env, request } = ctx;
  const u = await currentUser(ctx, false);
  const sp = params(request);
  const limit = clampInt(sp.get('limit'), 200, 1, 500);

  if (hasRole(u, 'admin', 'finance')) {
    const where = [];
    const binds = [];
    const pid = san(sp.get('project_id') || '');
    const status = san(sp.get('status') || '');
    if (pid) { where.push('project_id = ?'); binds.push(pid); }
    if (status) { where.push('status = ?'); binds.push(status); }
    const sql = `SELECT * FROM donations${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT ${limit}`;
    const { results } = await env.DB.prepare(sql).bind(...binds).all();
    return json(results);
  }

  const pid = san(sp.get('project_id') || '');
  if (!isUuid(pid)) fail('Admin access required', 403);
  const { results } = await env.DB.prepare(
    "SELECT d.id, d.amount, CASE WHEN d.is_anonymous = 1 THEN NULL ELSE d.donor_name END AS donor_name, d.is_anonymous, d.message, d.created_at FROM donations d JOIN projects p ON p.id = d.project_id AND p.is_suspended = 0 AND p.status IN ('active','funded') WHERE d.project_id = ? AND d.status = 'completed' ORDER BY d.created_at DESC LIMIT ?"
  ).bind(pid, Math.min(limit, 50)).all();
  return json(results);
}

// POST /api/donations: creates a PENDING donation (guests allowed).
export async function onRequestPost(ctx) {
  await rateLimit(ctx, 'donate', 20, 60);
  const u = await currentUser(ctx, false);
  return json(await createDonationRow(ctx.env, await readBody(ctx.request), u), 201);
}
