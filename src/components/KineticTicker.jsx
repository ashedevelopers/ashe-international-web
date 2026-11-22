import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { TICKER } from '../data/asheContent.js';

// One endless row. Driven by Framer Motion (not CSS keyframes) so it keeps sliding on every browser.
function Row({ items, reverse = false, dur = 20, outline = false }) {
  const list = [...items, ...items];
  return (
    <div className='overflow-hidden'>
      <motion.div className='flex w-max gap-8' animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}>
        {list.map((t, i) => (
          <span key={i} className={`whitespace-nowrap font-display text-[42px] uppercase md:text-[64px] ${outline ? 'text-transparent [-webkit-text-stroke:1.5px_#ffffff]' : i % 2 ? 'text-ashe-yellow' : 'text-white'}`}>{t} <span className='text-ashe-yellow'>✦</span></span>
        ))}
      </motion.div>
    </div>
  );
}

// Two rows sliding in opposite directions, skewing with your scroll speed.
export default function KineticTicker({ items = TICKER }) {
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skewX = useTransform(smooth, [-2000, 2000], [-8, 8], { clamp: true });
  return (
    <motion.div style={{ skewX }} className='my-10 -rotate-[1.2deg] bg-ashe-deep py-3.5' aria-label='What we do'>
      <Row items={items} dur={22} />
      <Row items={[...items].reverse()} reverse dur={28} outline />
    </motion.div>
  );
}
