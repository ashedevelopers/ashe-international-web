import { VALUES } from '../data/about.js';
import { Reveal } from './ui.jsx';
import { Sparkle } from './Deco.jsx';

const TONES = ['bg-ashe-mint', 'bg-ashe-yellow', 'bg-ashe-clay', 'bg-[#B9DDF2]', 'bg-[#A8E6B5]'];

// The five core values as numbered colour-block cards.
export default function Values() {
  return (
    <section className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-8 text-center text-[clamp(38px,8vw,92px)]'>Our core values</h2>
      <div className='mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        {VALUES.map((v, i) => (
          <Reveal key={v.t} i={i} tilt={i % 2 ? 2 : -2}>
            <article className={`flex h-full min-h-[220px] flex-col rounded-[24px] border-2 border-ashe-ink p-5 ${TONES[i]}`}>
              <div className='flex items-center justify-between'><span className='font-display text-5xl leading-none'>{String(i + 1).padStart(2, '0')}</span><Sparkle className='h-8 w-8 animate-spin-slow' /></div>
              <h3 className='mt-4 text-[26px]'>{v.t}</h3>
              <p className='mt-2 text-[15px]'>{v.d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
