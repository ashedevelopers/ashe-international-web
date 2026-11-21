import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PAGES } from '../data/site.js';
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
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const acct = user ? { to: '/dashboard', l: 'Dashboard' } : { to: '/login', l: 'Sign in' };
  const link = ({ isActive }) => `text-[14px] font-semibold hover:text-ashe-green ${isActive ? 'text-ashe-green' : ''}`;

  return (
    <>
      <header className={`sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 backdrop-blur-xl transition-all xl:px-9 ${solid ? 'bg-white/90 py-1.5' : 'bg-white/70 py-2.5'}`}>
        <Link to='/' aria-label='ASHE home'>
          <img src='/images/logo.png' alt='ASHE: Action For Save Humanity in Emergency' className='h-10 w-auto xl:h-12'
            onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
        </Link>
        <nav className='hidden items-center gap-5 xl:flex' aria-label='Primary'>
          {PAGES.map((p) => <NavLink key={p.to} to={p.to} end={p.to === '/'} className={link}>{p.l}</NavLink>)}
          <NavLink to={acct.to} className={link}>{acct.l}</NavLink>
          <Button tone='yellow' onClick={onDonate}>Donate</Button>
        </nav>
        <button className='grid h-11 w-11 content-center justify-items-end gap-1.5 xl:hidden' aria-label='Menu' aria-expanded={open} onClick={() => setOpen(!open)}>
          <b className={`h-[3px] w-[26px] rounded bg-ashe-ink transition ${open ? 'translate-y-[9px] rotate-45' : ''}`} />
          <b className={`h-[3px] w-[18px] rounded bg-ashe-ink transition ${open ? 'opacity-0' : ''}`} />
          <b className={`h-[3px] w-[22px] rounded bg-ashe-ink transition ${open ? '-translate-y-[9px] -rotate-45 !w-[26px]' : ''}`} />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className='fixed inset-0 z-20 flex flex-col gap-1 overflow-auto bg-ashe-deep px-6 pb-6 pt-24 xl:hidden'
            initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}>
            {[...PAGES, { to: acct.to, l: acct.l }, { to: '#donate', l: 'Donate' }].map((n, i) => {
              const cls = `font-display text-[40px] uppercase leading-[1.05] ${n.to === '#donate' ? 'text-ashe-yellow' : 'text-white'}`;
              const anim = { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 + i * 0.045 } };
              return n.to === '#donate'
                ? <motion.button key='d' {...anim} className={`${cls} text-left`} onClick={() => { setOpen(false); onDonate(); }}>{n.l}</motion.button>
                : <motion.div key={n.to} {...anim}><Link to={n.to} className={cls} onClick={() => setOpen(false)}>{n.l}</Link></motion.div>;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
