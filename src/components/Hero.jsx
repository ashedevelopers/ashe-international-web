import { motion } from 'framer-motion';
import { HERO } from '../data/asheContent.js';
import { SITE } from '../data/site.js';
import { Button, Img, Sticker } from './ui.jsx';
import { RotatingBadge } from './Deco.jsx';

const STAR = 'polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)';
const STACK = [
  { k: 'Where?', v: 'Nakivale Refugee Settlement', tone: 'bg-ashe-ink text-white' },
  { k: 'Who?', v: 'Refugees & host communities', tone: 'bg-[#B9DDF2]' },
  { k: 'What?', v: 'Skills, farming & enterprise', tone: 'bg-ashe-yellow' },
];

// Tinted hero card (star-cut photo, stacked headline, location sticker, spinning badge) beside a stack of colour-block info cards.
export default function Hero({ onDonate }) {
  return (
    <section id='top' className='mx-3.5 mt-3 grid gap-2.5 md:mx-7 lg:grid-cols-[1.5fr_1fr]'>
      <div className='relative overflow-hidden rounded-[32px] bg-ashe-mint px-5 pb-28 pt-8 text-center md:px-10 md:pt-12'>
        <motion.div className='mx-auto h-40 w-40 md:h-52 md:w-52' style={{ clipPath: STAR }} initial={{ scale: 0.5, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 13 }}>
          <Img name='community' alt='Community gathering in Nakivale' className='h-full w-full object-cover' loading='eager' fetchpriority='high' />
        </motion.div>
        <p className='mt-4 text-[13px] font-bold uppercase tracking-[.12em]'>{SITE.full}</p>
        <h1 className='mt-3 text-[clamp(46px,12vw,130px)]'>
          {HERO.lines.map((l, i) => (
            <span key={l} className='block overflow-hidden'>
              <motion.span className={`block ${i === 2 ? 'text-ashe-green' : ''}`} initial={{ y: '105%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.25 + i * 0.14, ease: [0.2, 0.8, 0.2, 1] }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <p className='mx-auto mt-4 max-w-md'>{HERO.body}</p>
        <div className='mt-5 flex flex-wrap justify-center gap-2.5'>
          <Button onClick={onDonate}>Donate now</Button>
          <Button as='a' tone='white' href='#programs' icon='↓'>Our programs</Button>
        </div>
        <Sticker rotate={-8} className='absolute bottom-6 left-4 md:left-8'>📍 {HERO.tag}</Sticker>
        <RotatingBadge className='absolute bottom-4 right-4 h-20 w-20 md:h-24 md:w-24' />
      </div>
      <div className='grid gap-2.5 content-start'>
        {STACK.map((c, i) => (
          <motion.div key={c.k} className={`rounded-[22px] p-5 ${c.tone}`} initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.1, duration: 0.7 }}>
            <small className='block text-xs font-bold uppercase tracking-[.1em]'>{c.k}</small>
            <p className='mt-3 font-display text-[28px] uppercase leading-none md:text-[34px]'>{c.v}</p>
          </motion.div>
        ))}
        <motion.button onClick={onDonate} className='rounded-[22px] bg-ashe-clay p-5 text-left' initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02 }}>
          <small className='block text-xs font-bold uppercase tracking-[.1em]'>How?</small>
          <p className='mt-3 font-display text-[28px] uppercase leading-none md:text-[34px]'>Give or partner →</p>
        </motion.button>
      </div>
    </section>
  );
}
