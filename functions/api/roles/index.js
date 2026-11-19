import { json, fail, readBody, required, san } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { currentUser, requireAdmin, hasRole } from '../../_lib/auth.js';

const ALLOWED = ['admin', 'designer', 'finance', 'partner', 'donor', 'fundraiser'];

// GET /api/roles: admins see staff roles; everyone else sees their own.
export async function onRequestGet(ctx) {
  const { env } = ctx;
  const u = await currentUser(ctx);
  const q = hasRole(u, 'admin')
    ? env.DB.prepare("SELECT * FROM user_roles WHERE role IN ('admin','designer','finance','partner') ORDER BY created_at DESC")
    : env.DB.prepare('SELECT * FROM user_roles WHERE user_id = ?').bind(u.sub);
  const { results } = await q.all();
  return json(results);
}

// POST /api/roles (admin): assign a role by user_id or email.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await requireAdmin(ctx);
  const b = await readBody(request);
  const role = san(String(required(b, 'role')));
  let uid = san(String(b.user_id || ''));
  const email = String(b.email || '').trim().toLowerCase();

  if (!uid && email) {
    const row = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (!row) fail('No user found with that email.', 404);
    uid = row.id;
  }
  if (!uid) fail('Provide a user email or user id.');
  if (!(await env.DB.prepare('SELECT 1 AS ok FROM users WHERE id = ?').bind(uid).first())) fail('User not found.', 404);
  if (!ALLOWED.includes(role)) fail('Invalid role');

  const id = uuid();
  try {
    await env.DB.prepare('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)').bind(id, uid, role).run();
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) fail('Role already assigned', 409);
    throw e;
  }
  return json({ id, user_id: uid, role }, 201);
}
