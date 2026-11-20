import { json, readBody } from '../../_lib/http.js';
import { uuid } from '../../_lib/crypto.js';
import { currentUser, requireAdmin } from '../../_lib/auth.js';
import { rateLimit } from '../../_lib/ratelimit.js';
import { nstr } from '../../_lib/fields.js';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

// GET /api/bugs (admin)
export async function onRequestGet(ctx) {
  await requireAdmin(ctx);
  const { results } = await ctx.env.DB.prepare('SELECT * FROM bug_reports ORDER BY created_at DESC LIMIT 200').all();
  return json(results);
}

// POST /api/bugs (anyone, rate limited)
export async function onRequestPost(ctx) {
  await rateLimit(ctx, 'bug', 10, 60);
  const b = await readBody(ctx.request);
  const u = await currentUser(ctx, false);
  const id = uuid();
  const severity = SEVERITIES.includes(b.severity) ? b.severity : 'medium';
  await ctx.env.DB.prepare('INSERT INTO bug_reports (id, reporter_id, title, description, url, severity) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, u ? u.sub : null, nstr(b.title, 200) || 'Bug report', nstr(b.description), nstr(b.url), severity).run();
  return json({ id }, 201);
}
