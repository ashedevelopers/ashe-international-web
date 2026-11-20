import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO } from '../data/asheContent.js';
import { Button, Img, Sticker, Svg } from './ui.jsx';
import { emblem } from './icons.js';

export default function Hero({ onDonate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  return (
    <section ref={ref} id='top' className='relative mx-3.5 mt-3 flex min-h-[620px] items-end overflow-hidden rounded-[32px] text-white md:mx-7 md:min-h-[720px]'>
      <motion.div style={{ y }} className='absolute inset-0 scale-110'>
        <Img name='community' alt='Community gathering in Nakivale' className='h-full w-full object-cover' loading='eager' fetchpriority='high' />
      </motion.div>
      <div className='absolute inset-0 bg-gradient-to-b from-ashe-deep/10 to-ashe-deep/80' />
      <Svg src={emblem} className='absolute right-4 top-4 z-10 h-24 w-24 md:right-8 md:top-7 md:h-36 md:w-36' />
      <motion.div className='absolute right-4 top-[130px] z-10 rotate-[4deg] rounded-2xl bg-white px-3.5 py-2.5 font-display text-3xl leading-none text-ashe-ink md:right-12 md:top-[190px] md:text-5xl'
        initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 4 }} transition={{ delay: 1, type: 'spring', stiffness: 220, damping: 14 }}>
        {HERO.chip.value}<small className='mt-1 block font-sans text-[11px] font-bold uppercase tracking-wider'>{HERO.chip.label}</small>
      </motion.div>
      <div className='relative z-10 w-full max-w-4xl p-6 pb-7 md:p-12'>
        <Sticker className='mb-3.5'>{HERO.tag}</Sticker>
        <h1 className='text-[clamp(52px,13vw,150px)]'>
          {HERO.lines.map((l, i) => (
            <span key={l} className='block overflow-hidden'>
              <motion.span className={`block ${i === 2 ? 'text-ashe-yellow' : ''}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2 + i * 0.14, ease: [0.2, 0.8, 0.2, 1] }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <p className='my-4 max-w-md opacity-90'>{HERO.body}</p>
        <div className='flex flex-wrap gap-2.5'>
          <Button tone='yellow' onClick={onDonate}>Donate now</Button>
          <Button as='a' tone='white' href='#programs' icon='↓'>Our programs</Button>
        </div>
      </div>
    </section>
  );
}
