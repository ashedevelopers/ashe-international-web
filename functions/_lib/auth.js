import { fail } from './http.js';
import { jwtSign, jwtVerify } from './crypto.js';

export const TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days, same as the legacy API

function secret(env) {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) fail('Server is misconfigured: JWT_SECRET missing or too short.', 500);
  return env.JWT_SECRET;
}

export function issueToken(env, user) {
  const now = Math.floor(Date.now() / 1000);
  return jwtSign({ sub: user.id, email: user.email, roles: user.roles || [], iat: now, exp: now + TOKEN_TTL }, secret(env));
}

export const tokenCookie = (token, maxAge = TOKEN_TTL) =>
  `ashe_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

function readToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (/^bearer /i.test(auth)) return auth.slice(7).trim();
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)ashe_token=([^;]+)/);
  return m ? m[1] : null;
}

export async function userRoles(env, userId) {
  const { results } = await env.DB.prepare('SELECT role FROM user_roles WHERE user_id = ?').bind(userId).all();
  return results.map((r) => r.role);
}

export async function userFull(env, userId) {
  const u = await env.DB
    .prepare('SELECT u.id, u.email, u.is_active, p.display_name, p.avatar_url FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = ?')
    .bind(userId).first();
  if (!u) return null;
  u.roles = await userRoles(env, userId);
  return u;
}

// Roles and active flag are re-read from D1 so revoked roles/accounts take effect immediately.
export async function currentUser({ request, env }, required = true) {
  const token = readToken(request);
  if (!token) { if (required) fail('Unauthenticated', 401); return null; }
  const payload = await jwtVerify(token, secret(env));
  if (!payload) { if (required) fail('Invalid or expired token', 401); return null; }
  const row = await env.DB.prepare('SELECT is_active FROM users WHERE id = ?').bind(payload.sub).first();
  if (!row || !row.is_active) { if (required) fail('Account unavailable', 401); return null; }
  payload.roles = await userRoles(env, payload.sub);
  return payload;
}

export const hasRole = (u, ...roles) => !!u && roles.some((r) => (u.roles || []).includes(r));

export async function requireRole(ctx, ...roles) {
  const u = await currentUser(ctx);
  if (!hasRole(u, ...roles)) fail('Insufficient permissions', 403);
  return u;
}

export async function requireAdmin(ctx) {
  const u = await currentUser(ctx);
  if (!hasRole(u, 'admin')) fail('Admin access required', 403);
  return u;
}
