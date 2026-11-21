import { useState } from 'react';
import { Button } from './ui.jsx';

const field = 'w-full rounded-xl border-2 border-ashe-ink bg-white p-3 text-base';
const label = 'mb-1 mt-3 block text-xs font-bold uppercase tracking-wider';

// Generic lead form: volunteer signups and contact messages post to /api/submit.
export default function LeadForm({ type, messageLabel = 'Message', button = 'Send', success }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, type, method: type, page: window.location.pathname }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error?.message || 'Something went wrong. Please try again.');
      setState('done');
    } catch (x) { setErr(x.message); setState('idle'); }
  }

  if (state === 'done') return <div className='py-8 text-center'><div className='font-display text-5xl uppercase text-ashe-green'>Thank you!</div><p className='mt-2'>{success}</p></div>;
  return (
    <form onSubmit={submit}>
      <label className={label}>Full name</label><input required className={field} value={f.name} onChange={set('name')} />
      <label className={label}>Email</label><input required type='email' className={field} value={f.email} onChange={set('email')} />
      <label className={label}>Phone / WhatsApp (optional)</label><input type='tel' className={field} value={f.phone} onChange={set('phone')} />
      <label className={label}>{messageLabel}</label><textarea required rows={5} className={field} value={f.message} onChange={set('message')} />
      <input tabIndex={-1} autoComplete='off' aria-hidden='true' className='absolute -left-[9999px]' value={f.website} onChange={set('website')} />
      {err && <p role='alert' className='mt-2 text-sm font-semibold text-red-700'>{err}</p>}
      <div className='mt-4'><Button type='submit' disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : button}</Button></div>
    </form>
  );
}
