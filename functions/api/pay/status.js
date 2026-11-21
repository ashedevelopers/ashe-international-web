import { json, fail } from '../../_lib/http.js';
import { rateLimit } from '../../_lib/ratelimit.js';
import { syncByReference } from '../../_lib/nylon.js';
import { params } from '../../_lib/util.js';

// GET /api/pay/status?reference=...: the donation page polls this after the phone prompt.
export async function onRequestGet(ctx) {
  await rateLimit(ctx, 'paystatus', 60, 60);
  const ref = params(ctx.request).get('reference') || '';
  if (!/^[a-f0-9]{14}$/.test(ref)) fail('Not found', 404);
  const status = await syncByReference(ctx.env, ref);
  if (status === null) fail('Not found', 404);
  return json({ status });
}
