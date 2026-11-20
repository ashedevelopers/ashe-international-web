import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { STATS, STORY } from '../data/asheContent.js';
import { Img, Reveal, Sticker } from './ui.jsx';

function CountUp({ to, plus }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{plus && to > 10 ? '+' : ''}</span>;
}

export default function HighlightStrip() {
  return (
    <section id='story' className='mx-3.5 my-16 md:mx-7'>
      <div className='grid items-center gap-6 md:grid-cols-2 md:gap-12'>
        <Reveal><Img name='team' alt='The ASHE field team' className='aspect-[4/3] w-full rounded-[28px] object-cover' /></Reveal>
        <Reveal i={1}>
          <Sticker tone='mint'>{STORY.tag}</Sticker>
          <h2 className='mt-3 text-[clamp(40px,8vw,84px)]'>{STORY.title}</h2>
          <p className='mt-3.5 max-w-xl text-[17px]'>{STORY.body}</p>
        </Reveal>
      </div>
      <div className='mt-6 grid gap-2.5 md:grid-cols-3'>
        {STATS.map((s, i) => (
          <Reveal key={s.label} i={i} className={`rounded-3xl p-5 ${s.tone}`}>
            <div className='font-display text-7xl leading-none'><CountUp to={s.value} plus={s.plus} /></div>
            <p className='mt-1 text-sm font-semibold'>{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
