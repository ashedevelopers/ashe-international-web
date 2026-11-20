import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '../data/asheContent.js';
import { Button, Svg } from './ui.jsx';
import { emblem } from './icons.js';

export default function Navbar({ onDonate }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <>
      <header className={`sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 backdrop-blur-xl transition-all md:px-9 ${solid ? 'bg-ashe-cream/85 py-2' : 'bg-ashe-cream/60 py-3'}`}>
        <a href='#top' className='flex items-center gap-2 font-display text-[26px] uppercase'>
          <Svg src={emblem} className='h-9 w-9' />ASHE
        </a>
        <nav className='hidden items-center gap-7 md:flex' aria-label='Primary'>
          {NAV.map((n) => <a key={n.href} href={n.href} className='text-[15px] font-semibold hover:text-ashe-green'>{n.label}</a>)}
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
            {[...NAV, { label: 'Donate', href: '#donate' }].map((n, i) => (
              <motion.a key={n.href} href={n.href} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                onClick={(e) => { setOpen(false); if (n.href === '#donate') { e.preventDefault(); onDonate(); } }}
                className={`font-display text-[54px] uppercase leading-none ${n.href === '#donate' ? 'text-ashe-yellow' : 'text-white'}`}>{n.label}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
