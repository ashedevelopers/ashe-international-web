import { fail } from '../../_lib/http.js';
import { requireRole } from '../../_lib/auth.js';

// GET /api/files/:name (admin/finance): private R2 objects (consent forms, payout proofs, KYC).
export async function onRequestGet(ctx) {
  const { env, params } = ctx;
  await requireRole(ctx, 'admin', 'finance');
  if (!/^[a-f0-9]{32}\.[a-z0-9]{2,4}$/.test(params.name)) fail('Not found', 404);
  if (!env.UPLOADS) fail('File storage is not configured yet (R2 binding missing).', 503);
  const obj = await env.UPLOADS.get(`private/${params.name}`);
  if (!obj) fail('Not found', 404);
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${params.name}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  });
}
