// GET /api/health  -> smoke test for Pages Functions. Real API modules are ported in Step 3.
export async function onRequestGet() {
  return Response.json({ ok: true, service: 'ashe-international-web', time: new Date().toISOString() });
}
