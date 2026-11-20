import { fail, san } from './http.js';
import { uuid } from './crypto.js';
import { hasRole } from './auth.js';
import { toFlag } from './util.js';

// Marks a donation completed exactly once and bumps project totals. Idempotent and atomic:
// the project update only matches while the donation is still not completed, and both run in one D1 batch.
export async function completeDonation(env, id, reference = null) {
  const d = await env.DB.prepare('SELECT status FROM donations WHERE id = ?').bind(id).first();
  if (!d) return false;
  if (d.status === 'completed') return true;
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE projects SET raised_amount = raised_amount + (SELECT amount FROM donations WHERE id = ?1 AND status != 'completed'), donor_count = donor_count + 1 WHERE id = (SELECT project_id FROM donations WHERE id = ?1 AND status != 'completed')"
    ).bind(id),
    env.DB.prepare("UPDATE donations SET status = 'completed', payment_reference = COALESCE(?, payment_reference) WHERE id = ? AND status != 'completed'").bind(reference, id),
  ]);
  return true;
}

// Creates a PENDING donation. Only admins may record an already-completed (offline) donation.
export async function createDonationRow(env, b, u) {
  const amount = Math.round(Number(b.amount || 0) * 100) / 100;
  if (!(amount >= 1) || amount > 10000000) fail('Enter a valid amount.');
  const currency = String(b.currency || 'USD').replace(/[^A-Za-z]/g, '').toUpperCase() || 'USD';
  if (currency.length !== 3) fail('Invalid currency');
  const projectId = san(b.project_id || '') || null;
  if (projectId) {
    const ok = await env.DB
      .prepare("SELECT 1 AS ok FROM projects WHERE id = ? AND status IN ('active','funded') AND is_suspended = 0")
      .bind(projectId).first();
    if (!ok) fail('That campaign is not accepting donations.');
  }
  const isAdmin = hasRole(u, 'admin');
  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO donations (id, project_id, donor_user_id, donor_name, donor_email, amount, currency, message, is_anonymous, status, payment_provider, payment_reference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id, projectId, u?.sub ?? null,
    san(String(b.donor_name || '')).slice(0, 100) || null,
    san(String(b.donor_email || '')).slice(0, 255) || null,
    amount, currency,
    san(String(b.message || '')).slice(0, 1000) || null,
    toFlag(b.is_anonymous), 'pending',
    isAdmin ? (san(b.payment_provider || '') || 'manual') : null,
    isAdmin ? (san(b.payment_reference || '') || null) : null
  ).run();
  if (isAdmin && b.status === 'completed') await completeDonation(env, id);
  return env.DB.prepare('SELECT * FROM donations WHERE id = ?').bind(id).first();
}
