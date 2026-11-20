import { json, fail, readBody } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { requireRole } from '../../_lib/auth.js';
import { assertOwnsProject } from '../../_lib/ownership.js';
import { nstr } from '../../_lib/fields.js';
import { isUuid } from '../../_lib/util.js';

// POST /api/proxy_receivers (admin or the project's owner)
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'fundraiser');
  const b = await readBody(request);
  if (!isUuid(b.payout_id)) fail('payout_id required');
  const payout = await env.DB.prepare('SELECT project_id FROM project_payouts WHERE id = ?').bind(b.payout_id).first();
  if (!payout) fail('Forbidden', 403);
  await assertOwnsProject(env, payout.project_id, u);
  const name = nstr(b.full_name, 150);
  if (!name) fail('Full name required');
  const id = uuid();
  await env.DB.prepare('INSERT INTO proxy_receivers (id, payout_id, full_name, id_document_url, position) VALUES (?, ?, ?, ?, ?)')
    .bind(id, b.payout_id, name, nstr(b.id_document_url), parseInt(b.position ?? 1, 10) || 1).run();
  return json({ id }, 201);
}
