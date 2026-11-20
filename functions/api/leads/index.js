import { requireAdmin } from '../../_lib/auth.js';
import { json } from '../../_lib/http.js';
import { params, clampInt } from '../../_lib/util.js';
import { san } from '../../_lib/http.js';

// GET /api/leads?type= (admin): pledges, volunteer signups, partner inquiries, contact messages.
export async function onRequestGet(ctx) {
  await requireAdmin(ctx);
  const sp = params(ctx.request);
  const type = san(sp.get('type') || '');
  const sql = `SELECT * FROM leads${type ? ' WHERE type = ?' : ''} ORDER BY created_at DESC LIMIT ${clampInt(sp.get('limit'), 200, 1, 500)}`;
  const q = ctx.env.DB.prepare(sql);
  return json((await (type ? q.bind(type) : q).all()).results);
}
