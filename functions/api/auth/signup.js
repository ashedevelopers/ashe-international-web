import { json, fail, readBody, required, isEmail, san, slugify } from '../../_lib/http.js';
import { hashPassword, uuid } from '../../_lib/crypto.js';
import { issueToken, userFull, tokenCookie } from '../../_lib/auth.js';
import { rateLimit } from '../../_lib/ratelimit.js';

// POST /api/auth/signup  (audience: 'donor' | 'fundraiser'; donors may register an organization)
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'signup', 5, 60);
  const b = await readBody(request);
  const email = String(required(b, 'email')).trim().toLowerCase();
  const password = String(required(b, 'password'));
  const name = san(String(required(b, 'name')));
  const audience = san(b.audience || 'donor');
  const donorKind = san(b.donor_kind || 'individual');
  const orgName = san(b.org_name || '');
  const orgType = san(b.org_type || 'ngo');
  const orgAbout = san(b.org_about || '');
  const orgWebsite = san(b.org_website || '');
  const orgCountry = san(b.org_country || '');

  if (!isEmail(email)) fail('Invalid email address');
  if (password.length < 8) fail('Password must be at least 8 characters');
  if (password.length > 128) fail('Password too long');
  if (name.length < 1) fail('Name is required');
  if (name.length > 100) fail('Name too long');

  const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (exists) fail('An account with this email already exists', 409);

  const uid = uuid();
  const hash = await hashPassword(password);
  const role = audience === 'fundraiser' ? 'fundraiser' : 'donor';
  const stmts = [
    env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(uid, email, hash),
    env.DB.prepare('INSERT INTO profiles (id, user_id, display_name) VALUES (?, ?, ?)').bind(uuid(), uid, name),
    env.DB.prepare('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)').bind(uuid(), uid, role),
  ];
  if (audience === 'donor' && donorKind === 'organization' && orgName) {
    stmts.push(
      env.DB.prepare(
        'INSERT INTO organizations (id, owner_id, name, slug, org_type, description, website, country, is_donor, accepted_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)'
      ).bind(uuid(), uid, orgName, `${slugify(orgName)}-${uid.slice(0, 6)}`, orgType, orgAbout, orgWebsite || null, orgCountry || null)
    );
  }
  try {
    await env.DB.batch(stmts); // atomic
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) fail('An account with this email already exists', 409);
    throw e;
  }

  const full = await userFull(env, uid);
  const token = await issueToken(env, full);
  return json({ user: full, access_token: token }, 201, { 'Set-Cookie': tokenCookie(token) });
}
