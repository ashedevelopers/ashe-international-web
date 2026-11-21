// GET /api/health -> smoke test and config check. Reports only yes/no, never secret values.
export async function onRequestGet({ env }) {
  let db = false;
  try { db = !!(await env.DB?.prepare('SELECT 1 AS ok').first()); } catch { /* stays false */ }
  return Response.json({
    ok: true,
    service: 'ashe-international-web',
    time: new Date().toISOString(),
    db,
    kv: !!env.KV,
    r2: !!env.UPLOADS,
    jwt_secret_set: !!env.JWT_SECRET,
    jwt_secret_long_enough: !!env.JWT_SECRET && env.JWT_SECRET.length >= 32,
  });
}
