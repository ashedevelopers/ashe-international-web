import { json, fail, readBody, san, slugify } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { currentUser, requireRole, hasRole } from '../../_lib/auth.js';
import { notifyAdmin } from '../../_lib/notify.js';
import { toFlag, params, clampInt } from '../../_lib/util.js';
import { isUuid } from '../../_lib/util.js';

const FLAGS = ['is_promoted', 'is_staff_pick', 'is_loved', 'is_suspended'];
const ORDER_COLS = ['created_at', 'updated_at', 'title', 'raised_amount', 'goal_amount', 'donor_count'];

// GET /api/projects: public sees active/funded; owners also see their own; admin/designer see all.
export async function onRequestGet(ctx) {
  const { env, request } = ctx;
  const u = await currentUser(ctx, false);
  const staff = hasRole(u, 'admin', 'designer');
  const sp = params(request);
  const get = (k) => san(sp.get(k) || '');
  const where = [];
  const binds = [];

  if (staff) { /* everything */ }
  else if (u) { where.push("((status IN ('active','funded') AND is_suspended = 0) OR owner_id = ?)"); binds.push(u.sub); }
  else where.push("status IN ('active','funded') AND is_suspended = 0");

  let v;
  if ((v = get('category')) !== '') { where.push('category = ?'); binds.push(v); }
  if ((v = get('status')) !== '') { where.push('status = ?'); binds.push(v); }
  if ((v = get('owner_id')) !== '' && (staff || (u && u.sub === v))) { where.push('owner_id = ?'); binds.push(v); }
  for (const f of FLAGS) {
    const raw = sp.get(f);
    if (raw !== null && raw !== '') { where.push(`${f} = ?`); binds.push(toFlag(raw)); }
  }
  if ((v = get('id')) !== '') {
    const ids = v.split(',').filter(isUuid);
    if (ids.length) { where.push(`id IN (${ids.map(() => '?').join(',')})`); binds.push(...ids); }
  }

  const order = ORDER_COLS.includes(sp.get('order')) ? sp.get('order') : 'created_at';
  const dir = toFlag(sp.get('asc') || 'false') ? 'ASC' : 'DESC';
  const limit = clampInt(sp.get('limit'), 200, 1, 500);
  const sql = `SELECT * FROM projects${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY ${order} ${dir} LIMIT ${limit}`;
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json(results);
}

// POST /api/projects: admin/designer/fundraiser. Fundraiser submissions start as 'pending' and notify admins.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'designer', 'fundraiser');
  const b = await readBody(request);
  const title = san(String(b.title || ''));
  if (title === '' || title.length > 200) fail('A title (max 200 characters) is required');
  const goal = Number(b.goal_amount || 0);
  if (!(goal >= 0) || goal > 100000000) fail('Invalid goal amount');

  const id = uuid();
  const slug = `${slugify(title)}-${id.slice(0, 6)}`;
  const isStaff = hasRole(u, 'admin', 'designer');
  const status = isStaff && ['draft', 'pending', 'active'].includes(b.status) ? b.status : 'pending';

  await env.DB.prepare(
    'INSERT INTO projects (id, owner_id, title, slug, category, location, story, image_url, goal_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id, u.sub, title, slug, san(String(b.category || 'general')) || 'general',
    san(String(b.location || '')) || null, san(String(b.story || '')) || null,
    san(String(b.image_url || '')) || null, goal, status
  ).run();

  if (!isStaff) await notifyAdmin(env, 'project_submitted', 'New campaign pending review', title, { project_id: id });
  return json(await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first(), 201);
}
