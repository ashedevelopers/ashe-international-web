import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Sticker } from './ui.jsx';

const field = 'w-full rounded-xl border-2 border-ashe-ink bg-white p-3 text-base';

// Newsletter signup. It is stored as a "contact" lead with the method "newsletter" (visible in Dashboard > Leads & pledges).
export default function Newsletter() {
  const [f, setF] = useState({ name: '', email: '', website: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, type: 'contact', method: 'newsletter', message: 'Newsletter signup', page: window.location.pathname }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error?.message || 'Something went wrong. Please try again.');
      setState('done');
    } catch (x) { setErr(x.message); setState('idle'); }
  }
  return (
    <section className='mx-3.5 my-16 md:mx-7'>
      <div className='mx-auto grid max-w-5xl items-center gap-6 rounded-[32px] border-2 border-ashe-ink bg-ashe-mint p-6 md:grid-cols-2 md:p-10'>
        <div>
          <Sticker rotate={-3}>Stay in touch</Sticker>
          <h2 className='mt-3 text-[clamp(34px,5vw,60px)]'>Get news from Nakivale</h2>
          <p className='mt-2'>Short updates on our work, new reports and campaigns. No spam, and you can leave at any time.</p>
        </div>
        {state === 'done' ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='text-center'><div className='font-display text-5xl uppercase text-ashe-green'>Thank you!</div><p>You are on the list.</p></motion.div>
        ) : (
          <form onSubmit={submit} className='grid gap-3'>
            <input required className={field} placeholder='Your name' value={f.name} onChange={set('name')} aria-label='Your name' />
            <input required type='email' className={field} placeholder='Your email' value={f.email} onChange={set('email')} aria-label='Your email' />
            <input tabIndex={-1} autoComplete='off' aria-hidden='true' className='absolute -left-[9999px]' value={f.website} onChange={set('website')} />
            {err && <p role='alert' className='text-sm font-semibold text-red-700'>{err}</p>}
            <div><Button type='submit' disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Subscribe'}</Button></div>
          </form>
        )}
      </div>
    </section>
  );
}
