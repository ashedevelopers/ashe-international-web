// Email is provider-pluggable. Resend is wired as a placeholder; swap the fetch for any provider.
// With no provider configured, emails are skipped (logged) so flows keep working in development.
export async function sendMail(env, to, subject, html) {
  const from = env.MAIL_FROM || 'info@asheinternational.org';
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `ASHE International <${from}>`, to: [to], subject, html }),
    });
    if (!r.ok) console.error('[ASHE mail] send failed', r.status);
    return r.ok;
  }
  console.warn('[ASHE mail] no mail provider configured; email not sent');
  return false;
}
