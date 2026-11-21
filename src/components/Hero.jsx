import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { HERO } from '../data/asheContent.js';
import { Button, Img, Sticker } from './ui.jsx';

const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';
const DELAY = 6500;

// Slide content follows the hero slider on asheinternational.org (sewing, permaculture, mushrooms, women's center campaign).
const SLIDES = [
  { tag: 'Sewing Training', title: 'Sewing Machine Training and Learning', text: 'Vocational skills that turn into sustainable livelihoods for refugees and host communities.', image: 'community', alt: 'Community members handling fabric during sewing training in Nakivale' },
  { tag: 'Permaculture', title: 'Resilient Roots: Empowering Refugees through Permaculture', text: 'Sustainable agriculture and reforestation that protect the land and feed families in Nakivale.', image: 'irrigation', alt: 'Irrigating crops in Nakivale' },
  { tag: 'Mushroom Cultivation', title: 'Harvesting Hope: Empowering Refugees through Mushroom Cultivation', text: 'Reliable nutrition and a pathway to financial independence, grown inside the settlement.', image: 'market', alt: 'Handing over fresh produce to families' },
  { tag: 'Featured Campaign', title: "Let's build a center for Nakivale's refugee women", text: 'A campaign to build a center for refugee women in Nakivale Refugee Settlement, Uganda.', image: 'outreach', alt: 'ASHE team meeting women in Nakivale' },
];

// Round ASHE logo (the circular mark): the wide logo image cropped to its left square inside a circle.
function RoundLogo({ className = '' }) {
  return (
    <motion.div className={`overflow-hidden rounded-full border-[3px] border-ashe-yellow bg-white shadow-lg ${className}`} animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      <img src='/images/logo.png' alt='ASHE logo' className='h-full w-full object-cover object-left'
        onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
    </motion.div>
  );
}

export default function Hero({ onDonate }) {
  const ref = useRef(null);
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

  const s = SLIDES[i];
  return (
    <section ref={ref} id='top' className='relative mx-3.5 mt-3 min-h-[640px] overflow-hidden rounded-[32px] text-white md:mx-7 md:min-h-[740px]'
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)} aria-roledescription='carousel' aria-label='ASHE highlights'>
      <motion.div style={{ y, touchAction: 'pan-y' }} className='absolute inset-0 scale-110' drag='x' dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1); else if (info.offset.x > 60) go(i - 1); }}>
        <AnimatePresence initial={false}>
          <motion.div key={s.image} className='absolute inset-0' initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <Img name={s.image} alt={s.alt} className='h-full w-full object-cover' loading='eager' fetchpriority={i === 0 ? 'high' : 'auto'} draggable={false} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-ashe-deep/10 to-ashe-deep/85' />

      <RoundLogo className='absolute right-4 top-4 z-10 h-24 w-24 md:right-8 md:top-7 md:h-36 md:w-36' />
      <motion.div className='absolute right-4 top-[132px] z-10 rotate-[4deg] rounded-2xl bg-white px-3.5 py-2.5 font-display text-3xl leading-none text-ashe-ink md:right-12 md:top-[196px] md:text-5xl'
        initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 4 }} transition={{ delay: 1, type: 'spring', stiffness: 220, damping: 14 }}>
        {HERO.chip.value}<small className='mt-1 block font-sans text-[11px] font-bold uppercase tracking-wider'>{HERO.chip.label}</small>
      </motion.div>

      <div className='relative z-10 flex min-h-[640px] flex-col justify-end p-6 pb-24 md:min-h-[740px] md:p-12 md:pb-28'>
        <AnimatePresence mode='wait'>
          <motion.div key={i} className='max-w-4xl' initial='hidden' animate='show' exit='out'
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } }, out: { opacity: 0, y: -16, transition: { duration: 0.3 } } }}>
            <motion.div variants={{ hidden: { opacity: 0, x: -30, rotate: -8 }, show: { opacity: 1, x: 0, rotate: -4 } }}><Sticker rotate={-4}>{s.tag}</Sticker></motion.div>
            <motion.h1 className='mt-3.5 text-[clamp(38px,9.5vw,104px)]' variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } } }}>{s.title}</motion.h1>
            <motion.p className='my-4 max-w-lg opacity-90' variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 0.92, y: 0 } }}>{s.text}</motion.p>
            <motion.div className='flex flex-wrap gap-2.5' variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <Button tone='yellow' onClick={onDonate}>Donate now</Button>
              <Button as='a' tone='white' href='#programs' icon='↓'>Our programs</Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between gap-4 md:left-12 md:right-12'>
        <div className='flex items-center gap-2' role='tablist' aria-label='Choose slide'>
          {SLIDES.map((x, n) => (
            <button key={x.tag} role='tab' aria-selected={n === i} aria-label={`Slide ${n + 1}: ${x.tag}`} onClick={() => go(n)} className='relative h-2.5 w-10 overflow-hidden rounded-full bg-white/35 md:w-14'>
              {n === i && <motion.span key={`${i}-${paused}`} className='absolute inset-y-0 left-0 bg-ashe-yellow' initial={{ width: paused ? '100%' : '0%' }} animate={{ width: '100%' }} transition={{ duration: paused ? 0 : DELAY / 1000, ease: 'linear' }} />}
              {n < i && <span className='absolute inset-0 bg-ashe-yellow' />}
            </button>
          ))}
          <span className='ml-2 font-display text-lg tabular-nums'>{String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
        </div>
        <div className='flex gap-2'>
          {[['‹', 'Previous slide', -1], ['›', 'Next slide', 1]].map(([t, l, d]) => (
            <button key={l} aria-label={l} onClick={() => go(i + d)} className='grid h-11 w-11 place-items-center rounded-full border-2 border-white/80 bg-black/20 text-2xl backdrop-blur transition hover:bg-ashe-yellow hover:text-ashe-ink'>{t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
