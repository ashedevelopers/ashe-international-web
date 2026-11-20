import { json, fail, readBody, san, slugify } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { currentUser, hasRole } from '../../_lib/auth.js';
import { nstr } from '../../_lib/fields.js';
import { params, toFlag } from '../../_lib/util.js';

// GET /api/organizations?owner_id=: admins list all; others may only list their own.
export async function onRequestGet(ctx) {
  const u = await currentUser(ctx);
  const owner = san(params(ctx.request).get('owner_id') || '');
  const admin = hasRole(u, 'admin');
  if (!admin && owner !== u.sub) fail('Forbidden', 403);
  const q = owner
    ? ctx.env.DB.prepare('SELECT * FROM organizations WHERE owner_id = ? ORDER BY created_at DESC LIMIT 200').bind(owner)
    : ctx.env.DB.prepare('SELECT * FROM organizations ORDER BY created_at DESC LIMIT 200');
  return json((await q.all()).results);
}

// POST /api/organizations (signed in)
export async function onRequestPost(ctx) {
  const u = await currentUser(ctx);
  const b = await readBody(ctx.request);
  const name = san(String(b.name || ''));
  if (!name) fail('Organization name required');
  const id = uuid();
  await ctx.env.DB.prepare(
    'INSERT INTO organizations (id, owner_id, name, slug, org_type, description, website, country, is_donor, accepted_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, u.sub, name, `${slugify(name)}-${id.slice(0, 6)}`, nstr(b.org_type, 30) || 'ngo', nstr(b.description), nstr(b.website, 255), nstr(b.country, 50), toFlag(b.is_donor), toFlag(b.accepted_terms)).run();
  return json(await ctx.env.DB.prepare('SELECT * FROM organizations WHERE id = ?').bind(id).first(), 201);
}
