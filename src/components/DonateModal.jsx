import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DONATE } from '../data/asheContent.js';
import { Button } from './ui.jsx';

const INTENTS = { Give: 'pledge', Partner: 'partner', Volunteer: 'volunteer' };
const field = 'w-full rounded-xl border-2 border-ashe-ink bg-white p-3 text-base';
const label = 'mb-1 mt-3 block text-xs font-bold uppercase tracking-wider';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// Mobile Money gifts are charged through Nylon Pay (/api/pay/*). Bank/International pledges, partner
// inquiries and volunteer signups are saved through /api/submit.
export default function DonateModal({ open, onClose }) {
  const [intent, setIntent] = useState('Give');
  const [method, setMethod] = useState('Mobile Money');
  const [f, setF] = useState({ amount: '', currency: 'UGX', name: '', email: '', phone: '', organization: '', message: '', website: '' });
  const [state, setState] = useState('idle'); // idle | sending | waiting | done
  const [paid, setPaid] = useState(false);
  const [err, setErr] = useState('');
  const alive = useRef(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const give = intent === 'Give';
  const momo = give && method === 'Mobile Money';

  useEffect(() => {
    alive.current = open;
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);

  async function pay() {
    const r = await post('/api/pay/start', { amount: f.amount, name: f.name, email: f.email, phone: f.phone, message: f.message, website: f.website });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.error?.message || 'Could not start the payment. Please try again.');
    setState('waiting');
    for (let i = 0; i < 60 && alive.current; i++) { // up to 3 minutes
      await wait(3000);
      const s = await fetch(`/api/pay/status?reference=${j.data.reference}`).then((x) => x.json()).catch(() => ({}));
      if (s?.data?.status === 'completed') { setPaid(true); setState('done'); return; }
      if (s?.data?.status === 'failed') throw new Error('The payment was declined or cancelled. You can try again.');
    }
    if (alive.current) throw new Error('We have not received confirmation yet. If you approved the payment, your donation will appear shortly.');
  }

  async function submit(e) {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      if (momo) await pay();
      else {
        const r = await post('/api/submit', { ...f, type: INTENTS[intent], method: give ? method : intent, page: window.location.pathname });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.error?.message || 'Something went wrong. Please try again.');
        setPaid(false); setState('done');
      }
    } catch (x) { setErr(x.message); setState('idle'); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className='fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()} role='dialog' aria-modal='true' aria-label='Give or partner with ASHE'>
          <motion.div className='max-h-[92vh] w-full max-w-[560px] overflow-auto rounded-t-[28px] bg-ashe-cream p-6 md:rounded-[28px]' initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}>
            <div className='flex items-center justify-between'>
              <h3 className='text-4xl'>Join ASHE</h3>
              <button onClick={onClose} aria-label='Close' className='rounded-full border-2 border-ashe-ink px-3 py-1.5 font-bold'>✕</button>
            </div>
            {state === 'done' ? (
              <div className='py-8 text-center'><div className='font-display text-5xl uppercase text-ashe-green'>Thank you!</div>
                <p className='mt-2'>{paid ? 'Your donation was received. We are grateful for your support.' : `We received your ${give ? 'pledge' : 'message'} and will be in touch shortly.`}</p></div>
            ) : state === 'waiting' ? (
              <div className='py-10 text-center'><div className='font-display text-4xl uppercase'>Check your phone</div>
                <p className='mt-3'>Approve the mobile money prompt on {f.phone}. Keep this page open, it updates automatically.</p></div>
            ) : (
              <form onSubmit={submit}>
                <div className='mt-3.5 grid grid-cols-3 gap-1.5' role='tablist'>
                  {Object.keys(INTENTS).map((k) => <button type='button' key={k} role='tab' aria-selected={intent === k} onClick={() => setIntent(k)} className={`rounded-xl border-2 border-ashe-ink py-2 text-[13px] font-bold ${intent === k ? 'bg-ashe-ink text-ashe-cream' : ''}`}>{k}</button>)}
                </div>
                {give && (
                  <>
                    <div className='mt-2.5 grid grid-cols-2 gap-1.5'>
                      {Object.keys(DONATE.methods).map((m) => <button type='button' key={m} onClick={() => setMethod(m)} className={`rounded-xl border-2 border-ashe-green py-2 text-[13px] font-bold ${method === m ? 'bg-ashe-green text-white' : 'text-ashe-green'}`}>{m}</button>)}
                    </div>
                    <div className='my-2.5 flex flex-wrap gap-2'>
                      {DONATE.presets.map((a) => <button type='button' key={a} onClick={() => setF((p) => ({ ...p, amount: String(a) }))} className='rounded-full border-2 border-ashe-ink px-4 py-2 text-[13px] font-bold'>{a.toLocaleString()}</button>)}
                    </div>
                    <label className={label}>Amount</label>
                    <div className='grid grid-cols-[90px_1fr] gap-2'>
                      <select value={momo ? 'UGX' : f.currency} disabled={momo} onChange={set('currency')} className={field}>{DONATE.currencies.map((c) => <option key={c}>{c}</option>)}</select>
                      <input type='number' min={momo ? 500 : 1} required value={f.amount} onChange={set('amount')} className={field} />
                    </div>
                  </>
                )}
                <label className={label}>Full name</label><input required value={f.name} onChange={set('name')} className={field} />
                <label className={label}>Email</label><input required type='email' value={f.email} onChange={set('email')} className={field} />
                {intent === 'Partner' && <><label className={label}>Organization</label><input value={f.organization} onChange={set('organization')} className={field} /></>}
                <label className={label}>{give ? DONATE.methods[method].phoneLabel : 'Phone (optional)'}</label><input required={momo} type='tel' value={f.phone} onChange={set('phone')} className={field} placeholder={momo ? '+2567...' : ''} />
                <label className={label}>Message (optional)</label><textarea rows={2} value={f.message} onChange={set('message')} className={field} />
                <input tabIndex={-1} autoComplete='off' aria-hidden='true' value={f.website} onChange={set('website')} className='absolute -left-[9999px]' />
                {give && <p className='mt-3 text-[13px]'>{DONATE.methods[method].note}</p>}
                {err && <p role='alert' className='mt-2 text-sm font-semibold text-red-700'>{err}</p>}
                <Button type='submit' disabled={state === 'sending'} className='mt-4 w-full justify-between'>{state === 'sending' ? 'Sending...' : momo ? 'Pay with mobile money' : give ? 'Submit pledge' : 'Send'}</Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
