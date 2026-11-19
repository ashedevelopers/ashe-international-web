import { json, fail, readBody, required, isEmail } from '../../_lib/http.js';
import { randomHex, sha256Hex } from '../../_lib/crypto.js';
import { rateLimit } from '../../_lib/ratelimit.js';
import { sendMail } from '../../_lib/mail.js';

// POST /api/auth/reset-request: always answers OK to prevent account enumeration.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'reset', 5, 300);
  const b = await readBody(request);
  const email = String(required(b, 'email')).trim().toLowerCase();
  if (!isEmail(email)) fail('Invalid email');

  const u = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (u) {
    const token = randomHex(32);
    const expires = new Date(Date.now() + 3600 * 1000).toISOString();
    // Only the SHA-256 of the token is stored.
    await env.DB.prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?').bind(await sha256Hex(token), expires, u.id).run();
    const link = `${(env.APP_URL || '').replace(/\/$/, '')}/reset-password#access_token=${token}`;
    ctx.waitUntil(
      sendMail(env, email, 'Reset your ASHE password',
        `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto"><h2>Reset your password</h2><p>We received a request to reset the password for your ASHE International account.</p><p><a href="${link}" style="background:#0E622A;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">Choose a new password</a></p><p style="color:#666;font-size:13px">This link expires in 1 hour. If you did not request it, you can ignore this email.</p></div>`)
    );
  }
  return json({ message: 'If that email exists, a reset link has been sent.' });
}
