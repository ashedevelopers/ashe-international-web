import { json } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';

// GET /api/admin/health (admin): confirms bindings and secrets are wired. Never returns secret values.
export async function onRequestGet(ctx) {
  const { env } = ctx;
  await requireAdmin(ctx);
  let db = false;
  try { db = !!(await env.DB.prepare('SELECT 1 AS ok').first()); } catch { /* reported as false */ }
  return json({
    db,
    kv: !!env.KV,
    r2: !!env.UPLOADS,
    jwt_secret_ok: !!env.JWT_SECRET && env.JWT_SECRET.length >= 32,
    pesapal_configured: !!env.PESAPAL_CONSUMER_KEY && !!env.PESAPAL_CONSUMER_SECRET,
    mail_configured: !!env.RESEND_API_KEY,
    app_url: env.APP_URL || null,
  });
}
