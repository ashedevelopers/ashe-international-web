import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui.jsx';
import { Item } from './Motion.jsx';

const field = 'w-full rounded-xl border-2 border-ashe-ink bg-white p-3 text-base transition focus:-translate-y-0.5 focus:shadow-[0_6px_0_0_#0F0F0F] focus:outline-none';
const label = 'mb-1 mt-3 block text-xs font-bold uppercase tracking-wider';

// Generic lead form: volunteer signups and contact messages post to /api/submit. Fields rise in one after another.
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

  if (state === 'done') {
    return (
      <motion.div className='py-8 text-center' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }}>
        <div className='font-display text-5xl uppercase text-ashe-green'>Thank you!</div><p className='mt-2'>{success}</p>
      </motion.div>
    );
  }
  return (
    <motion.form onSubmit={submit} initial='hidden' whileInView='show' viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>
      <Item from='left'><label className={label}>Full name</label><input required className={field} value={f.name} onChange={set('name')} /></Item>
      <Item from='left'><label className={label}>Email</label><input required type='email' className={field} value={f.email} onChange={set('email')} /></Item>
      <Item from='left'><label className={label}>Phone / WhatsApp (optional)</label><input type='tel' className={field} value={f.phone} onChange={set('phone')} /></Item>
      <Item from='left'><label className={label}>{messageLabel}</label><textarea required rows={5} className={field} value={f.message} onChange={set('message')} /></Item>
      <input tabIndex={-1} autoComplete='off' aria-hidden='true' className='absolute -left-[9999px]' value={f.website} onChange={set('website')} />
      {err && <p role='alert' className='mt-2 text-sm font-semibold text-red-700'>{err}</p>}
      <Item className='mt-4'><Button type='submit' disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : button}</Button></Item>
    </motion.form>
  );
}
