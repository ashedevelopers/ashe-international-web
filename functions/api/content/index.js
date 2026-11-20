import { json, fail, readBody, required, san } from '../../_lib/http.js';
import { requireRole } from '../../_lib/auth.js';

const KEY_RE = /^[a-z0-9_.-]{1,50}$/i;
const parse = (r) => { try { return JSON.parse(r.value); } catch { return null; } };

// GET /api/content: all editable site content (sliders, programs, partners, curation ...).
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT key, value FROM homepage_content').all();
  return json(results.map((r) => ({ key: r.key, value: parse(r) })), 200, { 'Cache-Control': 'no-cache' });
}

// POST|PATCH|PUT /api/content (admin/designer): upsert one key.
async function upsert(ctx) {
  const { env, request } = ctx;
  await requireRole(ctx, 'admin', 'designer');
  const b = await readBody(request);
  const key = san(String(required(b, 'key')));
  if (!KEY_RE.test(key)) fail('Invalid content key');
  if (b.value === undefined || b.value === null) fail('value required');
  const encoded = JSON.stringify(b.value);
  if (encoded.length > 2_000_000) fail('Content too large');
  await env.DB.prepare(
    'INSERT INTO homepage_content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
  ).bind(key, encoded).run();
  return json({ key, value: b.value });
}
export const onRequestPost = upsert;
export const onRequestPatch = upsert;
export const onRequestPut = upsert;
