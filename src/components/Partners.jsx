import { Link } from 'react-router-dom';
import { PARTNERS } from '../data/partners.js';
import { Reveal, Sticker } from './ui.jsx';

// Square logo tile (logo is never cropped), type tag, short description and a link to the partner.
export function PartnerCards() {
  return (
    <div className='mx-auto grid max-w-5xl gap-4 md:grid-cols-3'>
      {PARTNERS.map((p, i) => (
        <Reveal key={p.name} i={i}>
          <article className='flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-ashe-ink bg-white'>
            <div className={`grid aspect-square place-items-center p-6 ${p.dark ? 'bg-black' : 'bg-white'}`}>
              <img src={`/images/partners/${p.file}`} alt={p.name} loading='lazy' className='h-full w-full object-contain' />
            </div>
            <div className='flex flex-1 flex-col gap-2 border-t-2 border-ashe-ink p-5'>
              <Sticker tone='mint' rotate={-2} className='self-start'>{p.kind}</Sticker>
              <h3 className='text-2xl'>{p.name}</h3>
              <p className='text-[15px]'>{p.text}</p>
              <a href={p.url} target='_blank' rel='noopener noreferrer' className='mt-auto pt-2 text-sm font-bold uppercase tracking-wider text-ashe-green hover:underline'>Visit website ↗</a>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default function Partners() {
  return (
    <section id='partners' className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-3 text-center text-[clamp(40px,8vw,92px)]'>Our partners</h2>
      <p className='mx-auto mb-7 max-w-xl text-center'>Organisations that stand with us and share our commitment to humanitarian action.</p>
      <PartnerCards />
      <p className='mt-6 text-center'><Link to='/partners' className='font-bold underline'>View all partners</Link></p>
    </section>
  );
}
