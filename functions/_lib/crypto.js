// WebCrypto helpers for Workers: JWT (HS256), password hashing, tokens.
const enc = new TextEncoder();
const dec = new TextDecoder();

export const uuid = () => crypto.randomUUID();
export const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
export const randomHex = (bytes = 32) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));
export const sha256Hex = async (s) => toHex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

const b64u = (buf) => {
  let s = '';
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64uStr = (s) => b64u(enc.encode(s));
const b64uDecode = (s) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

const hmacKey = (secret, usages) =>
  crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usages);

// Same token format as the legacy PHP API, so existing sessions stay valid if JWT_SECRET is unchanged.
export async function jwtSign(payload, secret) {
  const h = b64uStr(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64uStr(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret, ['sign']), enc.encode(`${h}.${p}`));
  return `${h}.${p}.${b64u(sig)}`;
}

export async function jwtVerify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret, ['verify']), b64uDecode(s), enc.encode(`${h}.${p}`));
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(b64uDecode(p)));
    if (!payload || (payload.exp && payload.exp < Math.floor(Date.now() / 1000))) return null;
    return payload;
  } catch { return null; }
}

// ---- Passwords ----
// New hashes: PBKDF2-SHA256 (Workers cap iterations at 100,000).
// Legacy PHP bcrypt hashes ($2y$...) are still accepted at sign-in, then upgraded transparently.
const ITERATIONS = 100000;
const pbkdf2 = async (password, salt, iter) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, key, 256);
};
const safeEqual = (a, b) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64u(salt)}$${b64u(await pbkdf2(password, salt, ITERATIONS))}`;
}

export async function verifyPassword(password, stored) {
  if (stored.startsWith('pbkdf2$')) {
    const [, iter, saltB64, hashB64] = stored.split('$');
    return safeEqual(b64u(await pbkdf2(password, b64uDecode(saltB64), Number(iter))), hashB64);
  }
  if (/^\$2[aby]\$/.test(stored)) {
    const bcrypt = (await import('bcryptjs')).default;
    return bcrypt.compare(password, stored);
  }
  return false;
}

export const needsRehash = (stored) => !stored.startsWith('pbkdf2$');
