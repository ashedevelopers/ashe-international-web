import { json, fail } from '../_lib/http.js';
import { randomHex } from '../_lib/crypto.js';
import { currentUser, hasRole } from '../_lib/auth.js';
import { sniffMime, EXT, IMAGE_MIMES } from '../_lib/sniff.js';

const PUBLIC_BUCKETS = ['project-media', 'homepage', 'avatars', 'partners', 'gallery', 'reports'];
const PRIVATE_BUCKETS = ['consent', 'payout-proofs', 'kyc'];
const MB = 1024 * 1024;

// POST /api/upload (multipart: file, bucket). Stored in R2 under public/ or private/.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await currentUser(ctx);
  if (!env.UPLOADS) fail('File storage is not configured yet (R2 binding missing).', 503);

  let form;
  try { form = await request.formData(); } catch { fail('Expected a multipart form upload.', 400); }
  const file = form.get('file');
  if (!file || typeof file === 'string') fail('No file uploaded');

  let bucket = String(form.get('bucket') || 'project-media').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'project-media';
  const isPrivate = PRIVATE_BUCKETS.includes(bucket);
  if (!isPrivate && !PUBLIC_BUCKETS.includes(bucket)) bucket = 'project-media';

  if (isPrivate) { if (!hasRole(u, 'admin', 'fundraiser', 'finance')) fail('Insufficient permissions', 403); }
  else if (!hasRole(u, 'admin', 'designer', 'partner', 'fundraiser')) fail('Insufficient permissions', 403);
  if (bucket === 'reports' && !hasRole(u, 'admin', 'designer')) fail('Insufficient permissions', 403);

  const allowed = isPrivate ? Object.keys(EXT) : bucket === 'reports' ? ['application/pdf'] : IMAGE_MIMES;
  const max = isPrivate || bucket === 'reports' ? 40 * MB : 8 * MB;
  if (file.size > max) fail(`File too large (max ${max / MB} MB).`, 413);

  const buf = await file.arrayBuffer();
  const mime = sniffMime(new Uint8Array(buf.slice(0, 600)));
  if (!mime || !allowed.includes(mime)) {
    fail(isPrivate ? 'Allowed: images, PDF, text and MP4/WebM/MOV video.' : bucket === 'reports' ? 'Annual reports must be PDF files.' : 'Only JPEG, PNG, WebP and GIF images are allowed.', 415);
  }

  const name = `${randomHex(16)}.${EXT[mime]}`;
  await env.UPLOADS.put(`${isPrivate ? 'private' : 'public'}/${name}`, buf, { httpMetadata: { contentType: mime }, customMetadata: { bucket, uploader: u.sub } });
  return isPrivate
    ? json({ url: `/api/files/${name}`, path: `private/${name}`, name, private: true }, 201)
    : json({ url: `/uploads/${name}`, path: `uploads/${name}`, name, private: false }, 201);
}
