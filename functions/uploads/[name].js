// GET /uploads/:name: public files from R2 (keeps the legacy /uploads/... URLs working).
export async function onRequestGet({ env, params }) {
  if (!env.UPLOADS || !/^[a-f0-9]{32}\.[a-z0-9]{2,4}$/.test(params.name)) return new Response('Not found', { status: 404 });
  const obj = await env.UPLOADS.get(`public/${params.name}`);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
