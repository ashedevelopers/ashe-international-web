import { json } from '../../_lib/http.js';
import { requireAdmin } from '../../_lib/auth.js';

// GET /api/notifications (admin)
export async function onRequestGet(ctx) {
  await requireAdmin(ctx);
  const { results } = await ctx.env.DB.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100').all();
  return json(results.map((n) => ({ ...n, metadata: n.metadata ? JSON.parse(n.metadata) : null })));
}
