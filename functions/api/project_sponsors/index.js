import { json, fail, readBody } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { requireRole, hasRole } from '../../_lib/auth.js';
import { isUuid, params } from '../../_lib/util.js';

// GET /api/project_sponsors?project_id=&organization_id= (public; live campaigns only)
export async function onRequestGet({ env, request }) {
  const sp = params(request);
  const where = [];
  const binds = [];
  if (isUuid(sp.get('project_id'))) { where.push('s.project_id = ?'); binds.push(sp.get('project_id')); }
  if (isUuid(sp.get('organization_id'))) { where.push('s.organization_id = ?'); binds.push(sp.get('organization_id')); }
  const sql = `SELECT s.id, s.project_id, s.organization_id, s.amount, o.name AS o_name, o.slug AS o_slug, o.logo_url AS o_logo, o.org_type AS o_type, p.title AS p_title, p.slug AS p_slug, p.image_url AS p_img, p.category AS p_cat, p.location AS p_loc FROM project_sponsors s JOIN organizations o ON o.id = s.organization_id JOIN projects p ON p.id = s.project_id AND p.is_suspended = 0 AND p.status IN ('active','funded')${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY s.amount DESC LIMIT 200`;
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json(results.map((r) => ({
    id: r.id, project_id: r.project_id, organization_id: r.organization_id, amount: r.amount,
    organization: { id: r.organization_id, name: r.o_name, slug: r.o_slug, logo_url: r.o_logo, org_type: r.o_type },
    project: { id: r.project_id, title: r.p_title, slug: r.p_slug, image_url: r.p_img, category: r.p_cat, location: r.p_loc },
  })));
}

// POST /api/project_sponsors: non-admins may only pledge on behalf of an organization they own.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'partner', 'donor', 'fundraiser');
  const b = await readBody(request);
  if (!isUuid(b.project_id) || !isUuid(b.organization_id)) fail('project_id and organization_id required');
  if (!hasRole(u, 'admin')) {
    const own = await env.DB.prepare('SELECT 1 AS ok FROM organizations WHERE id = ? AND owner_id = ?').bind(b.organization_id, u.sub).first();
    if (!own) fail('Forbidden', 403);
  }
  const amount = Number(b.amount || 0);
  if (!(amount > 0)) fail('Enter a pledge amount greater than zero.');
  const id = uuid();
  await env.DB.prepare('INSERT INTO project_sponsors (id, project_id, organization_id, amount) VALUES (?, ?, ?, ?)').bind(id, b.project_id, b.organization_id, amount).run();
  return json({ id }, 201);
}
