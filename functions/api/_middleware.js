import { HttpError } from '../_lib/http.js';

const strip = (h) => h.replace(/^www\./, '').toLowerCase();

// CORS (same-origin incl. www) + uniform JSON error envelope for every /api route.
export async function onRequest(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';
  const cors = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  };
  try {
    if (origin && env.APP_URL && strip(new URL(origin).hostname) === strip(new URL(env.APP_URL).hostname)) {
      cors['Access-Control-Allow-Origin'] = origin;
      cors['Vary'] = 'Origin';
      cors['Access-Control-Allow-Credentials'] = 'true';
    }
  } catch { /* ignore malformed origin */ }

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  let res;
  try {
    res = await context.next();
  } catch (e) {
    const known = e instanceof HttpError;
    if (!known) console.error(e);
    res = new Response(
      JSON.stringify({ data: null, error: { message: known ? e.message : 'Internal server error' } }),
      { status: known ? e.status : 500, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
    );
  }
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
  return out;
}
