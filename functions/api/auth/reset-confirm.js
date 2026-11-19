import { json, fail, readBody, required } from '../../_lib/http.js';
import { hashPassword, sha256Hex } from '../../_lib/crypto.js';
import { rateLimit } from '../../_lib/ratelimit.js';

// POST /api/auth/reset-confirm
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'reset_confirm', 5, 300);
  const b = await readBody(request);
  const token = String(required(b, 'token'));
  const password = String(required(b, 'password'));
  if (password.length < 8) fail('Password must be at least 8 characters');
  if (password.length > 128) fail('Password too long');

  const u = await env.DB
    .prepare('SELECT id FROM users WHERE reset_token = ? AND reset_expires > ?')
    .bind(await sha256Hex(token), new Date().toISOString()).first();
  if (!u) fail('Invalid or expired reset token', 400);

  await env.DB
    .prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(await hashPassword(password), u.id).run();
  return json({ message: 'Password updated. You can now sign in.' });
}
