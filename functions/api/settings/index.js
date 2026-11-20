import { json, fail, readBody, required, san } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';

// GET /api/settings (admin)
export async function onRequestGet(ctx) {
  await requireAdmin(ctx);
  const { results } = await ctx.env.DB.prepare('SELECT * FROM app_settings').all();
  return json(results);
}

// POST /api/settings (admin): upsert one key.
export async function onRequestPost(ctx) {
  await requireAdmin(ctx);
  const b = await readBody(ctx.request);
  const key = san(String(required(b, 'key')));
  if (key.length > 100) fail('Key too long');
  const value = String(b.value ?? '');
  await ctx.env.DB.prepare(
    'INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
  ).bind(key, value).run();
  return json({ key, value });
}
