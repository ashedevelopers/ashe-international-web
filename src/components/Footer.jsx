import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PAGES, SITE } from '../data/site.js';
import { Button } from './ui.jsx';
import { Sparkle } from './Deco.jsx';

// Yellow call-to-action card with sparkles and a tilted sticker.
export function CtaBand({ onDonate }) {
  return (
    <motion.section className='relative mx-3.5 my-16 overflow-hidden rounded-[32px] bg-ashe-yellow px-5 py-16 text-center md:mx-7'
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
      <Sparkle className='absolute left-5 top-5 h-10 w-10 opacity-90 md:left-12 md:h-16 md:w-16' />
      <Sparkle className='absolute bottom-5 right-6 h-14 w-14 opacity-90 md:right-16 md:h-24 md:w-24' />
      <span className='absolute right-4 top-6 rotate-[7deg] border border-ashe-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider'>Every gift counts</span>
      <h2 className='mx-auto max-w-4xl text-[clamp(42px,9vw,110px)]'>Help families stand on their own</h2>
      <div className='mt-6'><Button tone='white' onClick={onDonate}>Donate or pledge</Button></div>
    </motion.section>
  );
}

const big = 'font-display text-[34px] uppercase leading-[1.05] hover:underline md:text-[44px]';

// Full-bleed fresh-green footer: big nav links, round social badges, giant ASHE wordmark that rises in letter by letter.
export default function Footer() {
  return (
    <footer className='mt-16 bg-[#A8E6B5] px-5 pb-6 pt-10 text-ashe-ink md:px-12 md:pt-14'>
      <div className='grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]'>
        <nav aria-label='Footer' className='flex flex-wrap gap-x-7 gap-y-1'>
          {PAGES.map((p) => <Link key={p.to} to={p.to} className={big}>{p.l}</Link>)}
          <Link to='/start-fundraiser' className={big}>Fundraise</Link>
        </nav>
        <div>
          <h4 className='font-display text-2xl uppercase'>Contact</h4>
          <ul className='mt-2 grid gap-1.5'>
            <li><a className='underline' href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a className='underline' href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>{SITE.address}</li>
          </ul>
        </div>
        <div>
          <h4 className='font-display text-2xl uppercase'>Follow</h4>
          <div className='mt-2 flex flex-wrap gap-2'>
            {SITE.socials.map((s) => <a key={s.l} href={s.u} target='_blank' rel='noopener noreferrer' aria-label={s.l} className='grid h-11 min-w-11 place-items-center rounded-full border-2 border-ashe-ink px-3 text-xs font-bold hover:bg-ashe-ink hover:text-white'>{s.l === 'LinkedIn' ? 'in' : s.l === 'YouTube' ? 'YT' : s.l === 'Instagram' ? 'IG' : 'X'}</a>)}
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='mt-5 font-display text-xl uppercase underline'>Back to top</button>
        </div>
      </div>
      <div className='my-8 font-display text-[clamp(90px,34vw,420px)] uppercase leading-[.85]' aria-label='ASHE'>
        {[...'ASHE'].map((c, i) => (
          <motion.span key={i} aria-hidden='true' className='inline-block' initial={{ opacity: 0, y: '70%' }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.09, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>{c}</motion.span>
        ))}
        <p className='mt-1 font-sans text-[clamp(11px,2.4vw,22px)] font-bold uppercase tracking-[.2em]'>{SITE.full}</p>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
        <small>© 2026 ASHE International. All rights reserved.</small>
        <span className='flex gap-4'><Link to='/privacy' className='underline'>Privacy Policy</Link><Link to='/terms' className='underline'>Terms of Use</Link></span>
      </div>
    </footer>
  );
}
