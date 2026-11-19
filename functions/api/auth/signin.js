import { json, fail, readBody, required, isEmail } from '../../_lib/http.js';
import { verifyPassword, hashPassword, needsRehash } from '../../_lib/crypto.js';
import { issueToken, userFull, tokenCookie } from '../../_lib/auth.js';
import { rateLimit } from '../../_lib/ratelimit.js';

// POST /api/auth/signin
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'signin', 10, 60);
  const b = await readBody(request);
  const email = String(required(b, 'email')).trim().toLowerCase();
  const password = String(required(b, 'password'));
  if (!isEmail(email)) fail('Invalid email');

  const user = await env.DB.prepare('SELECT id, email, password_hash, is_active FROM users WHERE email = ?').bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) fail('Invalid email or password', 401);
  if (!user.is_active) fail('Account is inactive. Contact support.', 403);

  // Upgrade legacy bcrypt hashes to PBKDF2 after a successful login.
  if (needsRehash(user.password_hash)) {
    ctx.waitUntil(
      hashPassword(password).then((h) =>
        env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(h, user.id).run())
    );
  }

  const full = await userFull(env, user.id);
  const token = await issueToken(env, full);
  return json({ user: full, access_token: token }, 200, { 'Set-Cookie': tokenCookie(token) });
}
