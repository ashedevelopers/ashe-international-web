import { json } from '../../_lib/http.js';
import { currentUser } from '../../_lib/auth.js';

// GET /api/me/donations: donations made by the signed-in user (by account or by email).
export async function onRequestGet(ctx) {
  const u = await currentUser(ctx);
  const { results } = await ctx.env.DB.prepare(
    'SELECT d.id, d.amount, d.currency, d.status, d.created_at, p.title AS project_title FROM donations d LEFT JOIN projects p ON p.id = d.project_id WHERE d.donor_user_id = ?1 OR (d.donor_email IS NOT NULL AND lower(d.donor_email) = lower(?2)) ORDER BY d.created_at DESC LIMIT 200'
  ).bind(u.sub, u.email).all();
  return json(results);
}
