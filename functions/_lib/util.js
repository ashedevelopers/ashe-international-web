// Small shared helpers for route handlers.
export const isUuid = (s) => /^[a-f0-9-]{36}$/.test(s || '');
export const toFlag = (v) => (v === true || ['1', 'true'].includes(String(v).toLowerCase()) ? 1 : 0);
export const params = (request) => new URL(request.url).searchParams;
export const clampInt = (v, def, min, max) => {
  const n = parseInt(v ?? '', 10);
  return Math.max(min, Math.min(max, Number.isFinite(n) ? n : def));
};
// SQLite-compatible UTC timestamp ('YYYY-MM-DD HH:MM:SS') from any date-like input, or null.
export const sqlTime = (v) => {
  const t = Date.parse(String(v));
  return Number.isFinite(t) ? new Date(t).toISOString().replace('T', ' ').slice(0, 19) : null;
};
