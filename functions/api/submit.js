import { json, fail, readBody, isEmail } from '../_lib/http.js';
import { uuid } from '../_lib/crypto.js';
import { rateLimit } from '../_lib/ratelimit.js';
import { nstr } from '../_lib/fields.js';

const TYPES = ['pledge', 'volunteer', 'partner', 'contact'];
const b64u = (s) => btoa(s).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

// Google service-account access token (RS256 JWT bearer flow, WebCrypto only).
async function sheetsToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const head = `${b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }))}`;
  const der = Uint8Array.from(atob(sa.private_key.replace(/-----[^-]+-----|\s/g, '')), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head));
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${b64u(String.fromCharCode(...new Uint8Array(sig)))}` }),
  });
  if (!r.ok) throw new Error(`token ${r.status}`);
  return (await r.json()).access_token;
}

// Appends one row to the "ASHE Website Leads & Pledges" sheet. RAW mode: nothing is evaluated as a formula.
async function syncSheet(env, l) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON || !env.SHEET_ID) return;
  try {
    const token = await sheetsToken(JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON));
    const row = [new Date().toISOString(), l.type, l.name, l.email, l.phone, l.organization, l.amount, l.currency, l.method, l.message, l.page, l.id].map((v) => v ?? '');
    const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.SHEET_ID}/values/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    });
    if (!r.ok) throw new Error(`append ${r.status}`);
    await env.DB.prepare('UPDATE leads SET sheet_synced = 1 WHERE id = ?').bind(l.id).run();
  } catch (e) { console.error('[ASHE sheet sync]', e.message); } // D1 keeps the lead; sheet_synced stays 0 for retry
}

// POST /api/submit: donation pledges, volunteer signups, partner inquiries, contact messages.
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'submit', 8, 60);
  const b = await readBody(request);
  if (b.website) return json({ ok: true }); // honeypot: bots fill hidden fields
  const type = String(b.type || '');
  if (!TYPES.includes(type)) fail('Invalid submission type');
  const name = nstr(b.name, 100);
  const email = String(b.email || '').trim().toLowerCase();
  if (!name) fail('Name is required');
  if (!isEmail(email) || email.length > 255) fail('A valid email is required');

  let amount = null;
  let currency = null;
  if (type === 'pledge') {
    amount = Math.round(Number(b.amount) * 100) / 100;
    if (!(amount > 0) || amount > 1e9) fail('Enter a valid pledge amount');
    currency = (nstr(b.currency, 3) || 'USD').toUpperCase();
  }
  const lead = { id: uuid(), type, name, email, phone: nstr(b.phone, 40), organization: nstr(b.organization, 150), amount, currency, method: nstr(b.method, 40), message: nstr(b.message, 2000), page: nstr(b.page, 200) };
  await env.DB.prepare('INSERT INTO leads (id, type, name, email, phone, organization, amount, currency, method, message, page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(lead.id, type, name, email, lead.phone, lead.organization, amount, currency, lead.method, lead.message, lead.page).run();
  ctx.waitUntil(syncSheet(env, lead));
  return json({ ok: true, id: lead.id }, 201);
}
