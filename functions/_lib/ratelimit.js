import { fail } from './http.js';

// KV-backed sliding window per client IP. Skips silently if the KV binding is not configured yet.
export async function rateLimit({ request, env }, name, max = 10, windowSec = 60) {
  if (!env.KV) return;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rl:${name}:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const raw = await env.KV.get(key);
  const d = raw ? JSON.parse(raw) : { hits: [], blockedUntil: 0 };
  if (d.blockedUntil > now) fail('Too many requests. Try again later.', 429);
  d.hits = d.hits.filter((t) => t > now - windowSec);
  d.hits.push(now);
  const ttl = Math.max(windowSec * 2, 60);
  if (d.hits.length > max) {
    d.blockedUntil = now + windowSec;
    await env.KV.put(key, JSON.stringify(d), { expirationTtl: ttl });
    fail('Too many requests. Try again later.', 429);
  }
  await env.KV.put(key, JSON.stringify(d), { expirationTtl: ttl });
}
