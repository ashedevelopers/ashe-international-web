import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { HERO } from '../data/asheContent.js';
import { HERO_SLIDES as SLIDES } from '../data/home.js';
import { useCampaign } from '../lib/campaign.js';
import { Button, Img, Sticker } from './ui.jsx';

const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';
const DELAY = 6500;

// The slides (text, photos, campaign slide) live in src/data/home.js and are editable in Dashboard > Site content.

// Round ASHE logo. The outer div does the positioning; the inner circle clips the logo.
// logo.png is 900x316 and the emblem sits at x 17-307, y 38-263; these numbers centre it inside the border.
function RoundLogo({ className = '' }) {
  return (
    <div className={className}>
      <motion.div className='relative h-full w-full overflow-hidden rounded-full border-[3px] border-ashe-yellow bg-white shadow-lg' animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <img src='/images/logo.png' alt='ASHE logo' draggable={false}
          style={{ position: 'absolute', width: '285.9%', height: 'auto', maxWidth: 'none', left: '-1.45%', top: '2.04%' }}
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fb) return;
            el.dataset.fb = '1';
            el.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain';
            el.src = LIVE_LOGO;
          }} />
      </motion.div>
    </div>
  );
}

export default function Hero({ onDonate }) {
  const ref = useRef(null);
  const openCampaign = useCampaign();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), DELAY);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  const s = SLIDES[i] || SLIDES[0];
  return (
    <section ref={ref} id='top' className='relative mx-3.5 mt-3 min-h-[640px] overflow-hidden rounded-[32px] text-white md:mx-7 md:min-h-[740px]'
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)} aria-roledescription='carousel' aria-label='ASHE highlights'>
      <motion.div style={{ y, touchAction: 'pan-y' }} className='absolute inset-0 scale-110' drag='x' dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1); else if (info.offset.x > 60) go(i - 1); }}>
        <AnimatePresence initial={false}>
          <motion.div key={`${i}-${s.image}`} className='absolute inset-0' initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <Img name={s.image} alt={s.alt} className='h-full w-full object-cover' loading='eager' fetchpriority={i === 0 ? 'high' : 'auto'} draggable={false} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-ashe-deep/10 to-ashe-deep/85' />

      <RoundLogo className='absolute right-4 top-4 z-10 h-24 w-24 md:right-8 md:top-7 md:h-36 md:w-36' />
      <motion.div className='pointer-events-none absolute left-4 top-4 z-10 -rotate-[4deg] rounded-2xl bg-white px-3.5 py-2.5 font-display text-3xl leading-none text-ashe-ink md:left-8 md:top-7 md:text-5xl'
        initial={{ scale: 0, rotate: 12 }} animate={{ scale: 1, rotate: -4 }} transition={{ delay: 1, type: 'spring', stiffness: 220, damping: 14 }}>
        {HERO.chip.value}<small className='mt-1 block font-sans text-[11px] font-bold uppercase tracking-wider'>{HERO.chip.label}</small>
      </motion.div>

      <div className='relative z-10 flex min-h-[640px] flex-col justify-end p-6 pb-24 md:min-h-[740px] md:p-12 md:pb-28'>
        <AnimatePresence mode='wait'>
          <motion.div key={i} className='max-w-4xl' initial='hidden' animate='show' exit='out'
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } }, out: { opacity: 0, y: -16, transition: { duration: 0.3 } } }}>
            <motion.div className='mb-2' variants={{ hidden: { opacity: 0, x: -30, rotate: -8 }, show: { opacity: 1, x: 0, rotate: -4 } }}><Sticker rotate={-4}>{s.tag}</Sticker></motion.div>
            <motion.h1 className='mt-4 text-[clamp(38px,9.5vw,104px)]' variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } } }}>{s.title}</motion.h1>
            <motion.p className='my-4 max-w-lg opacity-90' variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 0.92, y: 0 } }}>{s.text}</motion.p>
            <motion.div className='flex flex-wrap gap-2.5' variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              {s.campaign ? (
                <>
                  <Button tone='yellow' onClick={() => openCampaign()}>Preview &amp; donate</Button>
                  <Button as='a' tone='white' href='/projects' icon='→'>See projects</Button>
                </>
              ) : (
                <>
                  <Button tone='yellow' onClick={onDonate}>Donate now</Button>
                  <Button as='a' tone='white' href='#programs' icon='↓'>Our programs</Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between gap-3 md:left-12 md:right-12'>
        <div className='flex min-w-0 items-center gap-1.5 md:gap-2' role='tablist' aria-label='Choose slide'>
          {SLIDES.map((x, n) => (
            <button key={`${x.tag}-${n}`} role='tab' aria-selected={n === i} aria-label={`Slide ${n + 1}: ${x.tag}`} onClick={() => go(n)} className='relative h-2.5 w-7 flex-none overflow-hidden rounded-full bg-white/35 md:w-14'>
              {n === i && <motion.span key={`${i}-${paused}`} className='absolute inset-y-0 left-0 bg-ashe-yellow' initial={{ width: paused ? '100%' : '0%' }} animate={{ width: '100%' }} transition={{ duration: paused ? 0 : DELAY / 1000, ease: 'linear' }} />}
              {n < i && <span className='absolute inset-0 bg-ashe-yellow' />}
            </button>
          ))}
          <span className='ml-1 flex-none whitespace-nowrap font-display text-base tabular-nums md:ml-2 md:text-lg'>{String(i + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}</span>
        </div>
        <div className='flex flex-none gap-2'>
          {[['‹', 'Previous slide', -1], ['›', 'Next slide', 1]].map(([t, l, d]) => (
            <button key={l} aria-label={l} onClick={() => go(i + d)} className='grid h-11 w-11 place-items-center rounded-full border-2 border-white/80 bg-black/20 text-2xl backdrop-blur transition hover:bg-ashe-yellow hover:text-ashe-ink'>{t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
