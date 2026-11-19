// Shared HTTP helpers. Response envelope matches the legacy API: { data, error }.
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const fail = (message, status = 400) => { throw new HttpError(status, message); };

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify({ data, error: null }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

export async function readBody(request) {
  try { return (await request.json()) ?? {}; } catch { return {}; }
}

export function required(body, key) {
  const v = body[key];
  if (v === undefined || v === null || v === '') fail(`Missing required field: ${key}`);
  return v;
}

// Strip HTML tags and trim, recursively (mirrors the legacy san()).
export const san = (v) =>
  typeof v === 'string' ? v.replace(/<[^>]*>/g, '').trim() : Array.isArray(v) ? v.map(san) : v;

export const slugify = (s) => {
  const t = String(s).replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 60);
  return t || 'item';
};

export const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
