import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '../data/asheContent.js';
import { useAuth } from '../lib/auth.jsx';
import { Button } from './ui.jsx';

const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';

export default function Navbar({ onDonate }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  const acct = user ? { to: '/dashboard', label: 'Dashboard' } : { to: '/login', label: 'Sign in' };

  return (
    <>
      <header className={`sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 backdrop-blur-xl transition-all md:px-9 ${solid ? 'bg-ashe-cream/85 py-1.5' : 'bg-ashe-cream/60 py-2.5'}`}>
        <a href='#top' aria-label='ASHE home'>
          <img src='/images/logo.png' alt='ASHE: Action For Save Humanity in Emergency' className='h-10 w-auto md:h-12'
            onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
        </a>
        <nav className='hidden items-center gap-7 md:flex' aria-label='Primary'>
          {NAV.map((n) => <a key={n.href} href={n.href} className='text-[15px] font-semibold hover:text-ashe-green'>{n.label}</a>)}
          <a href='#partners' className='text-[15px] font-semibold hover:text-ashe-green'>Partners</a>
          <Link to={acct.to} className='text-[15px] font-semibold hover:text-ashe-green'>{acct.label}</Link>
          <Button tone='yellow' onClick={onDonate}>Donate / Partner</Button>
        </nav>
        <button className='grid h-11 w-11 content-center justify-items-end gap-1.5 md:hidden' aria-label='Menu' aria-expanded={open} onClick={() => setOpen(!open)}>
          <b className={`h-[3px] w-[26px] rounded bg-ashe-ink transition ${open ? 'translate-y-[9px] rotate-45' : ''}`} />
          <b className={`h-[3px] w-[18px] rounded bg-ashe-ink transition ${open ? 'opacity-0' : ''}`} />
          <b className={`h-[3px] w-[22px] rounded bg-ashe-ink transition ${open ? '-translate-y-[9px] -rotate-45 !w-[26px]' : ''}`} />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className='fixed inset-0 z-20 flex flex-col gap-1.5 bg-ashe-deep px-6 pb-6 pt-24 md:hidden'
            initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}>
            {[...NAV, { label: 'Partners', href: '#partners' }, { label: acct.label, href: acct.to }, { label: 'Donate', href: '#donate' }].map((n, i) => {
              const cls = `font-display text-[48px] uppercase leading-none ${n.href === '#donate' ? 'text-ashe-yellow' : 'text-white'}`;
              const anim = { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.15 + i * 0.06 } };
              return n.href.startsWith('/')
                ? <motion.div key={n.href} {...anim}><Link to={n.href} className={cls} onClick={() => setOpen(false)}>{n.label}</Link></motion.div>
                : <motion.a key={n.href} href={n.href} {...anim} className={cls} onClick={(e) => { setOpen(false); if (n.href === '#donate') { e.preventDefault(); onDonate(); } }}>{n.label}</motion.a>;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
