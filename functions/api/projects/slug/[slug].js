import { json, fail } from '../../../_lib/http.js';
import { currentUser } from '../../../_lib/auth.js';
import { visible } from '../[id].js';

// GET /api/projects/slug/:slug
export async function onRequestGet(ctx) {
  const { env, params } = ctx;
  const p = await env.DB.prepare('SELECT * FROM projects WHERE slug = ?').bind(decodeURIComponent(params.slug)).first();
  if (!p || !visible(p, await currentUser(ctx, false))) fail('Not found', 404);
  return json(p);
}
