import { json, fail } from '../../../_lib/http.js';

// GET /api/organizations/slug/:slug (public)
export async function onRequestGet({ env, params }) {
  const o = await env.DB.prepare('SELECT * FROM organizations WHERE slug = ?').bind(decodeURIComponent(params.slug)).first();
  if (!o) fail('Not found', 404);
  return json(o);
}
