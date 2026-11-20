import { motion } from 'framer-motion';
import { PARTNERS } from '../data/partners.js';
import { Reveal } from './ui.jsx';

export default function Partners() {
  return (
    <section id='partners' className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-7 text-center text-[clamp(40px,8vw,92px)]'>Our partners</h2>
      <div className='mx-auto grid max-w-5xl gap-3 md:grid-cols-3'>
        {PARTNERS.map((p, i) => (
          <Reveal key={p.name} i={i}>
            <motion.div whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }} className={`grid h-44 place-items-center overflow-hidden rounded-[24px] border-2 border-ashe-ink p-4 ${p.tone}`}>
              <img src={`/images/partners/${p.file}`} alt={p.name} loading='lazy' className='max-h-full max-w-full object-contain' />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
