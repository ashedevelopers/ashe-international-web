import { motion } from 'framer-motion';
import { MOTTO } from '../data/about.js';
import { Sparkle } from './Deco.jsx';
import { Float, Item, Stagger } from './Motion.jsx';

// Big motto banner: words rise in one by one, sparkles float.
export default function MottoBand() {
  const words = MOTTO.split(' ');
  return (
    <section className='relative mx-3.5 my-14 overflow-hidden rounded-[32px] bg-ashe-ink px-5 py-14 text-center text-white md:mx-7 md:py-20'>
      <Float className='absolute left-5 top-5 md:left-12' amp={8} dur={5}><Sparkle className='h-10 w-10 animate-spin-slow [&_path]:fill-[#F9C61F] md:h-16 md:w-16' /></Float>
      <Float className='absolute bottom-5 right-6 md:right-14' amp={10} dur={6} delay={1}><Sparkle className='h-12 w-12 [&_path]:fill-[#CFE9D3] md:h-20 md:w-20' /></Float>
      <p className='mb-4 text-xs font-bold uppercase tracking-[.25em] text-ashe-yellow'>Our motto</p>
      <Stagger gap={0.12} className='mx-auto max-w-5xl'>
        <h2 className='text-[clamp(44px,10vw,128px)]'>
          {words.map((w, i) => (
            <Item key={i} as='span' className={`mr-[.22em] inline-block ${w.startsWith('Self') ? 'text-ashe-yellow' : ''}`}>{w}</Item>
          ))}
        </h2>
      </Stagger>
      <motion.div className='mx-auto mt-6 h-1 w-24 rounded-full bg-ashe-yellow' animate={{ width: [40, 140, 40] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    </section>
  );
}
