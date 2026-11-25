import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView } from 'framer-motion';
import { Button, Reveal, Sticker } from './ui.jsx';

// Figures are taken from the 2026 Annual Report (programme-area outputs and participant profile).
const NUMS = [
  { v: 213, l: 'People reached', n: 'across 7 villages in Nakivale', tone: 'bg-ashe-yellow' },
  { v: 2500, l: 'Seedlings raised', n: 'distributed to 120 households and 3 schools', tone: 'bg-ashe-mint' },
  { v: 90, l: 'Household gardens', n: 'kitchen gardens established', tone: 'bg-[#B9DDF2]' },
  { v: 50, l: 'Goats', n: 'to 5 groups on a pass-on model', tone: 'bg-ashe-clay' },
  { v: 100, l: 'Birds', n: 'to 40 households', tone: 'bg-[#A8E6B5]' },
  { v: 30, l: 'Youth trained', n: 'in digital skills', tone: 'bg-ashe-yellow' },
];

// Counts up from 0 and pops again every 3 seconds while on screen.
function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [n, setN] = useState(0);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!inView) return;
    setCycle((c) => c + 1);
    const id = setInterval(() => setCycle((c) => c + 1), 3000);
    return () => clearInterval(id);
  }, [inView]);
  useEffect(() => {
    if (!cycle) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [cycle, to]);
  return (
    <span ref={ref} className='inline-block'>
      <motion.span key={cycle} className='inline-block origin-left' initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>{n.toLocaleString()}</motion.span>
    </span>
  );
}

export default function YearGlance() {
  return (
    <section className='mx-3.5 my-16 md:mx-7'>
      <div className='mb-8 text-center'>
        <Sticker rotate={-4}>From our Annual Report</Sticker>
        <h2 className='mt-3 text-[clamp(40px,8vw,92px)]'>2026 at a glance</h2>
        <p className='mx-auto mt-3 max-w-xl'>Participant profile: 65% women, 35% host-community members, 25% youth under 25.</p>
      </div>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-3'>
        {NUMS.map((s, i) => (
          <Reveal key={s.l} i={i % 3} className={`h-full rounded-3xl border-2 border-ashe-ink p-5 ${s.tone}`}>
            <div className='font-display text-6xl leading-none md:text-7xl'><CountUp to={s.v} /></div>
            <p className='mt-2 text-lg font-bold'>{s.l}</p>
            <p className='text-sm'>{s.n}</p>
          </Reveal>
        ))}
      </div>
      <div className='mt-8 text-center'><Button as={Link} to='/reports' tone='yellow'>Read the full Annual Report</Button></div>
    </section>
  );
}
