import { motion } from 'framer-motion';
import { Sparkle } from './Deco.jsx';
import { useForceIn } from '../lib/motion.js';

const PILLARS = [
  { t: 'Sustainability at the core', d: 'We weave environmental stewardship into every project: reforestation, sustainable agriculture and waste management.', tone: 'bg-ashe-mint', r: -4 },
  { t: 'Community-centered approach', d: 'Refugees and host communities, especially single mothers, help plan and run our work, so their voices are heard.', tone: 'bg-ashe-clay', r: 3 },
  { t: 'Long-term impact', d: 'Skills and entrepreneurship help families earn an income and reach financial independence.', tone: 'bg-ashe-yellow', r: -3 },
];

// Three tilted pillar cards that straighten as they scroll into view.
export default function Pillars() {
  const forced = useForceIn();
  return (
    <section className='mx-3.5 my-14 md:mx-7'>
      <h2 className='mb-8 text-center text-[clamp(38px,8vw,92px)]'>What makes ASHE different</h2>
      <div className='mx-auto grid max-w-5xl gap-5 md:grid-cols-3'>
        {PILLARS.map((p, i) => (
          <motion.article key={p.t} className={`flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border-2 border-ashe-ink p-6 text-center ${p.tone}`}
            initial={{ rotate: p.r * 2, y: 50, opacity: 0 }} whileInView={{ rotate: p.r, y: 0, opacity: 1 }} animate={forced ? { rotate: p.r, y: 0, opacity: 1 } : undefined}
            viewport={{ once: true, amount: 0.3 }} whileHover={{ rotate: 0, y: -6 }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: i * 0.08 }}>
            <Sparkle className='h-16 w-16' />
            <h3 className='mt-4 text-[34px]'>{p.t}</h3>
            <p className='mt-2 text-[15px]'>{p.d}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
