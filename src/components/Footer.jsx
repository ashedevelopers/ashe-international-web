import { motion } from 'framer-motion';
import { FOOTER, NAV } from '../data/asheContent.js';
import { Button, Img } from './ui.jsx';

export function CtaBand({ onDonate }) {
  return (
    <section className='relative mx-3.5 my-16 overflow-hidden rounded-[32px] px-5 py-16 text-center text-white md:mx-7'>
      <Img name='families' className='absolute inset-0 h-full w-full object-cover' />
      <div className='absolute inset-0 bg-ashe-green/90' />
      <div className='relative'>
        <span className='inline-block rotate-[5deg] border border-ashe-ink bg-ashe-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ashe-ink'>Every gift counts</span>
        <h2 className='mx-auto my-5 max-w-3xl text-[clamp(40px,8vw,92px)]'>Help families stand on their own</h2>
        <Button tone='yellow' onClick={onDonate}>Donate or pledge</Button>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className='rounded-t-[32px] bg-ashe-deep px-5 pb-6 pt-9 text-white md:px-12 md:pt-14'>
      <nav className='flex flex-wrap gap-x-7 gap-y-1' aria-label='Footer'>
        {NAV.map((n) => <a key={n.href} href={n.href} className='font-display text-[32px] uppercase hover:text-ashe-yellow'>{n.label}</a>)}
      </nav>
      <div className='my-7 font-display text-[clamp(70px,22vw,260px)] uppercase leading-[.9] text-ashe-yellow' aria-label={FOOTER.cta.join(' ')}>
        {FOOTER.cta.map((w, k) => (
          <div key={w} aria-hidden='true'>
            {[...w].map((c, i) => (
              <motion.span key={i} className='inline-block' initial={{ opacity: 0, y: '60%' }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i + k * 5) * 0.05, duration: 0.6 }}>{c}</motion.span>
            ))}
          </div>
        ))}
      </div>
      <small className='opacity-75'>{FOOTER.copy}</small>
    </footer>
  );
}
