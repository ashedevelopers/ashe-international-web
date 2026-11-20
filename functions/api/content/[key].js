import { json, fail } from '../../_lib/http.js';

// GET /api/content/:key
export async function onRequestGet({ env, params }) {
  if (!/^[A-Za-z0-9_.-]{1,50}$/.test(params.key)) fail('Not found', 404);
  const r = await env.DB.prepare('SELECT key, value FROM homepage_content WHERE key = ?').bind(params.key).first();
  if (!r) return json(null);
  let value = null;
  try { value = JSON.parse(r.value); } catch { /* keep null */ }
  return json({ key: r.key, value });
}
