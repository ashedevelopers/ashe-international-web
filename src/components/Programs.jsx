import { motion } from 'framer-motion';
import { PROGRAMS } from '../data/asheContent.js';
import { ICONS } from './icons.js';
import { Img, Reveal, Svg } from './ui.jsx';

export default function Programs() {
  return (
    <section id='programs' className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-7 text-center text-[clamp(40px,8vw,92px)]'>What we do</h2>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {PROGRAMS.map((p, i) => (
          <Reveal key={p.title} i={i} tilt={i % 2 ? 2 : -2}>
            <motion.article whileHover={{ y: -8 }} className='group h-full overflow-hidden rounded-[28px] border-2 border-ashe-ink bg-white'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Img name={p.image} alt='' className='h-full w-full object-cover transition duration-700 group-hover:scale-110' />
                <Svg src={ICONS[p.icon]} className='absolute -bottom-6 left-3.5 h-[72px] w-[72px] rounded-[22px] border-2 border-ashe-ink bg-ashe-yellow p-2' />
              </div>
              <div className='px-[18px] pb-5 pt-10'>
                <h3 className='mb-2 text-[27px]'>{p.title}</h3>
                <p className='text-[14.5px]'>{p.text}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
