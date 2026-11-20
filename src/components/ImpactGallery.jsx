import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GALLERY } from '../data/asheContent.js';
import { Img } from './ui.jsx';

const CATS = ['All', ...new Set(GALLERY.map((g) => g.cat))];

export default function ImpactGallery() {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null); // index in GALLERY
  const visible = useMemo(() => GALLERY.map((g, i) => ({ ...g, i })).filter((g) => cat === 'All' || g.cat === cat), [cat]);
  const step = useCallback((d) => setOpen((cur) => {
    const idx = visible.findIndex((v) => v.i === cur);
    return visible[(idx + d + visible.length) % visible.length].i;
  }), [visible]);

  useEffect(() => {
    if (open === null) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, step]);

  return (
    <section id='impact' className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-7 text-center text-[clamp(40px,8vw,92px)]'>Community impact</h2>
      <div className='mb-5 flex flex-wrap justify-center gap-2' role='tablist'>
        {CATS.map((c) => (
          <button key={c} role='tab' aria-selected={cat === c} onClick={() => setCat(c)}
            className={`rounded-full border-2 border-ashe-ink px-4 py-2 text-[13px] font-bold transition ${cat === c ? 'bg-ashe-ink text-ashe-cream' : ''}`}>{c}</button>
        ))}
      </div>
      <motion.div layout className='columns-2 gap-2.5 md:columns-4'>
        <AnimatePresence mode='popLayout'>
          {visible.map((g) => (
            <motion.button layout key={g.image} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }} onClick={() => setOpen(g.i)} className='relative mb-2.5 block w-full cursor-zoom-in overflow-hidden rounded-[20px] [break-inside:avoid]'>
              <Img name={g.image} alt={g.caption} className='block w-full' />
              <span className='absolute bottom-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold'>{g.cat}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {open !== null && (
          <motion.div className='fixed inset-0 z-50 grid place-items-center bg-black/85 p-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setOpen(null)} role='dialog' aria-modal='true' aria-label='Photo viewer'>
            <figure className='text-center text-white'>
              <Img name={GALLERY[open].image} alt={GALLERY[open].caption} loading='eager' className='max-h-[78vh] max-w-[94vw] rounded-2xl border-[3px] border-white object-contain md:max-w-4xl' />
              <figcaption className='mt-3'>{GALLERY[open].caption}</figcaption>
            </figure>
            {[['✕', 'Close', () => setOpen(null), 'right-4 top-4'], ['‹', 'Previous', () => step(-1), 'left-3 top-1/2 md:left-10'], ['›', 'Next', () => step(1), 'right-3 top-1/2 md:right-10']].map(([t, l, fn, pos]) => (
              <button key={l} aria-label={l} onClick={fn} className={`absolute h-11 w-11 rounded-full bg-white text-xl text-ashe-ink ${pos}`}>{t}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
