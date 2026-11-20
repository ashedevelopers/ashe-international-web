import { json, fail, readBody } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { requireRole } from '../../_lib/auth.js';
import { assertOwnsProject } from '../../_lib/ownership.js';
import { nstr } from '../../_lib/fields.js';
import { isUuid, params } from '../../_lib/util.js';

const STATUSES = ['pending', 'active', 'completed'];

// GET /api/project_milestones?project_id= (public)
export async function onRequestGet({ env, request }) {
  const pid = params(request).get('project_id');
  if (!isUuid(pid)) fail('project_id required');
  const { results } = await env.DB.prepare('SELECT * FROM project_milestones WHERE project_id = ? ORDER BY position ASC').bind(pid).all();
  return json(results);
}

// POST /api/project_milestones: one milestone or an array (admin or the project's owner).
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'fundraiser');
  const b = await readBody(request);
  const rows = Array.isArray(b) ? b : [b];
  const stmts = [];
  const out = [];
  for (const m of rows) {
    if (!isUuid(m.project_id)) fail('Forbidden', 403);
    await assertOwnsProject(env, m.project_id, u);
    const title = nstr(m.title, 200);
    if (!title) fail('Each milestone needs a title.');
    const id = uuid();
    out.push({ id });
    stmts.push(env.DB.prepare('INSERT INTO project_milestones (id, project_id, position, title, description, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, m.project_id, parseInt(m.position ?? 1, 10) || 1, title, nstr(m.description), Math.max(0, Number(m.amount) || 0), STATUSES.includes(m.status) ? m.status : 'pending'));
  }
  if (stmts.length) await env.DB.batch(stmts);
  return json(out, 201);
}
