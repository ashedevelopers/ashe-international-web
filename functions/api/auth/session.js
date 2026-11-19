import { json } from '../../_lib/http.js';
import { currentUser, userFull } from '../../_lib/auth.js';

// GET /api/auth/session: returns { user: null } when signed out.
export async function onRequestGet(ctx) {
  const u = await currentUser(ctx, false);
  if (!u) return json({ user: null });
  return json({ user: await userFull(ctx.env, u.sub) });
}
