import { json, fail, readBody, san } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { currentUser, requireRole, hasRole } from '../../_lib/auth.js';

// GET /api/withdrawals (admin/finance)
export async function onRequestGet(ctx) {
  await requireRole(ctx, 'admin', 'finance');
  const { results } = await ctx.env.DB.prepare('SELECT * FROM withdrawal_requests ORDER BY created_at DESC LIMIT 100').all();
  return json(results);
}

// POST /api/withdrawals: a campaign owner (or admin) requests a payout.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  const u = await currentUser(ctx);
  const b = await readBody(request);
  const amount = Number(b.amount || 0);
  if (!(amount > 0)) fail('Enter a valid amount.');
  const pid = san(String(b.project_id || ''));
  const proj = await env.DB.prepare('SELECT owner_id, raised_amount FROM projects WHERE id = ?').bind(pid).first();
  if (!proj) fail('Project not found.', 404);
  if (proj.owner_id !== u.sub && !hasRole(u, 'admin')) fail('Forbidden', 403);

  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO withdrawal_requests (id, project_id, requester_id, amount, method, details, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, pid, u.sub, amount, san(String(b.method || 'bank')), san(String(b.details || '')) || null, 'pending').run();
  return json(await env.DB.prepare('SELECT * FROM withdrawal_requests WHERE id = ?').bind(id).first(), 201);
}
