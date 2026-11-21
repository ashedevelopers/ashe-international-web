import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { TICKER } from '../data/asheContent.js';

// Horizontal marquee that skews with scroll velocity and pauses on hover.
export default function KineticTicker({ items = TICKER }) {
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skewX = useTransform(smooth, [-2000, 2000], [-8, 8], { clamp: true });
  const list = [...items, ...items];
  return (
    <motion.div style={{ skewX }} className='group my-10 -rotate-[1.2deg] overflow-hidden bg-ashe-deep py-3.5' aria-label='What we do'>
      <div className='flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused]'>
        {list.map((t, i) => (
          <span key={i} className={`whitespace-nowrap font-display text-[42px] uppercase md:text-[64px] ${i % 2 ? 'text-ashe-yellow' : 'text-white'}`}>{t} <span className='text-ashe-yellow'>✦</span></span>
        ))}
      </div>
    </motion.div>
  );
}
