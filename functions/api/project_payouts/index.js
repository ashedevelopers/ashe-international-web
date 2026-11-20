import { json, fail, readBody } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { requireRole } from '../../_lib/auth.js';
import { assertOwnsProject } from '../../_lib/ownership.js';
import { nstr } from '../../_lib/fields.js';
import { isUuid } from '../../_lib/util.js';

// GET /api/project_payouts (admin/finance): contains bank and mobile-money details.
export async function onRequestGet(ctx) {
  await requireRole(ctx, 'admin', 'finance');
  const { results } = await ctx.env.DB.prepare('SELECT * FROM project_payouts ORDER BY created_at DESC LIMIT 200').all();
  return json(results);
}

// POST /api/project_payouts (admin or the project's owner)
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await requireRole(ctx, 'admin', 'fundraiser');
  const b = await readBody(request);
  if (!isUuid(b.project_id)) fail('Forbidden', 403);
  await assertOwnsProject(env, b.project_id, u);
  const method = nstr(b.method, 30) || 'bank';
  if (!['bank', 'mobile_money', 'proxy'].includes(method)) fail('Invalid payout method');
  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO project_payouts (id, project_id, method, country, network_provider, phone, swift_code, bank_name, account_holder, account_number, proxy_video_url, proxy_agreement_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, b.project_id, method, nstr(b.country, 60), nstr(b.network_provider, 60), nstr(b.phone, 40), nstr(b.swift_code, 20), nstr(b.bank_name, 120), nstr(b.account_holder, 120), nstr(b.account_number, 60), nstr(b.proxy_video_url), nstr(b.proxy_agreement_url)).run();
  return json(await env.DB.prepare('SELECT * FROM project_payouts WHERE id = ?').bind(id).first(), 201);
}
