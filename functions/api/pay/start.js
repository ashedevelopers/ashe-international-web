import { json, fail, readBody, isEmail } from '../../_lib/http.js';
import { createDonationRow } from '../../_lib/donations.js';
import { currentUser } from '../../_lib/auth.js';
import { rateLimit } from '../../_lib/ratelimit.js';
import { randomHex } from '../../_lib/crypto.js';
import { nylon } from '../../_lib/nylon.js';
import { nstr } from '../../_lib/fields.js';

// POST /api/pay/start: saves a PENDING donation, then asks Nylon Pay to prompt the donor's phone (MTN/Airtel).
export async function onRequestPost(ctx) {
  const { env, request } = ctx;
  await rateLimit(ctx, 'paystart', 6, 60);
  const b = await readBody(request);
  if (b.website) return json({ ok: true }); // honeypot
  const client = nylon(env); // 503 early if keys are missing

  const name = nstr(b.name, 100);
  const email = String(b.email || '').trim().toLowerCase();
  const phone = String(b.phone || '').replace(/[^\d+]/g, '');
  if (!name) fail('Name is required');
  if (!isEmail(email)) fail('A valid email is required');
  if (phone.replace(/\D/g, '').length < 9) fail('Enter the mobile money number to charge');
  if (String(b.currency || 'UGX').toUpperCase() !== 'UGX') fail('Mobile money payments are in UGX.');
  if (!(Number(b.amount) >= 500)) fail('The minimum mobile money gift is 500 UGX.');

  const u = await currentUser(ctx, false);
  const row = await createDonationRow(env, { ...b, currency: 'UGX', donor_name: name, donor_email: email }, u);
  const reference = randomHex(7); // 14 characters
  await env.DB.prepare("UPDATE donations SET payment_provider = 'nylonpay', tracking_id = ? WHERE id = ?").bind(reference, row.id).run();

  try {
    await client.collectPayment({
      amount: row.amount, currency: 'UGX', method: 'mobileMoney', reference,
      customer: { name, phoneNumber: phone },
      description: 'Donation to ASHE International',
    });
  } catch (e) {
    await env.DB.prepare("UPDATE donations SET status = 'failed' WHERE id = ?").bind(row.id).run();
    fail(e?.message || 'Could not start the payment. Check the number and try again.', 400);
  }
  return json({ reference, status: 'pending' }, 202);
}
