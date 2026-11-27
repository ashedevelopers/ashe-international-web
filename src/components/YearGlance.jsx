import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView } from 'framer-motion';
import { GLANCE } from '../data/home.js';
import { Button, Reveal, Sticker } from './ui.jsx';

// Counts up from 0 once, the first time it scrolls into view, then stays still.
function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className='inline-block'>
      <motion.span className='inline-block origin-left' initial={{ scale: 1.12 }} animate={inView ? { scale: 1 } : undefined} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>{n.toLocaleString()}</motion.span>
    </span>
  );
}

// Text and numbers come from src/data/home.js (editable in Dashboard > Site content).
export default function YearGlance() {
  return (
    <section className='mx-3.5 my-16 md:mx-7'>
      <div className='mb-8 text-center'>
        <Sticker rotate={-4}>{GLANCE.tag}</Sticker>
        <h2 className='mt-3 text-[clamp(40px,8vw,92px)]'>{GLANCE.title}</h2>
        <p className='mx-auto mt-3 max-w-xl'>{GLANCE.profile}</p>
      </div>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-3'>
        {GLANCE.items.map((s, i) => (
          <Reveal key={`${s.l}-${i}`} i={i % 3} className={`h-full rounded-3xl border-2 border-ashe-ink p-5 ${s.tone}`}>
            <div className='font-display text-6xl leading-none md:text-7xl'><CountUp to={Number(s.v) || 0} /></div>
            <p className='mt-2 text-lg font-bold'>{s.l}</p>
            <p className='text-sm'>{s.n}</p>
          </Reveal>
        ))}
      </div>
      <div className='mt-8 text-center'><Button as={Link} to='/reports' tone='yellow'>Read the full Annual Report</Button></div>
    </section>
  );
}
