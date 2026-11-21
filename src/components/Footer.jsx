import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FOOTER } from '../data/asheContent.js';
import { PAGES, SITE } from '../data/site.js';
import { useForceIn } from '../lib/motion.js';
import { Button, Img } from './ui.jsx';

const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';

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

const col = 'text-[15px] hover:text-ashe-yellow';

export default function Footer() {
  const forced = useForceIn();
  return (
    <footer className='rounded-t-[32px] bg-ashe-deep px-5 pb-6 pt-9 text-white md:px-12 md:pt-14'>
      <div className='grid gap-8 md:grid-cols-4'>
        <div>
          <Link to='/' aria-label='ASHE home' className='inline-block rounded-2xl bg-white p-3'>
            <img src='/images/logo.png' alt='ASHE: Action For Save Humanity in Emergency' className='h-12 w-auto md:h-14'
              onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
          </Link>
          <p className='mt-3 text-sm opacity-80'>Empowering refugees and host communities through training, partnerships and transparent fundraising.</p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {SITE.socials.map((s) => <a key={s.l} href={s.u} target='_blank' rel='noopener noreferrer' className='rounded-full border border-white/40 px-3 py-1 text-xs font-bold hover:bg-white hover:text-ashe-deep'>{s.l}</a>)}
          </div>
        </div>
        <nav aria-label='Explore'><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Explore</h4>
          <ul className='grid gap-1.5'>{PAGES.slice(0, 7).map((p) => <li key={p.to}><Link className={col} to={p.to}>{p.l}</Link></li>)}</ul></nav>
        <nav aria-label='Get involved'><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Get involved</h4>
          <ul className='grid gap-1.5'>
            <li><Link className={col} to='/start-fundraiser'>Start a Fundraiser</Link></li>
            <li><Link className={col} to='/volunteer'>Become a Volunteer</Link></li>
            <li><Link className={col} to='/partners'>Become a Partner</Link></li>
            <li><Link className={col} to='/contact'>Contact Us</Link></li>
          </ul></nav>
        <div><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Contact</h4>
          <ul className='grid gap-1.5 text-[15px]'>
            <li><a className={col} href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a className={col} href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className='opacity-80'>{SITE.address}</li>
          </ul></div>
      </div>
      <div className='my-8 font-display text-[clamp(70px,20vw,240px)] uppercase leading-[.9] text-ashe-yellow' aria-label={FOOTER.cta.join(' ')}>
        {FOOTER.cta.map((w, k) => (
          <div key={w} aria-hidden='true'>
            {[...w].map((c, i) => (
              <motion.span key={i} className='inline-block' initial={{ opacity: 0, y: '60%' }} whileInView={{ opacity: 1, y: 0 }} animate={forced ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true }} transition={{ delay: (i + k * 5) * 0.05, duration: 0.6 }}>{c}</motion.span>
            ))}
          </div>
        ))}
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2 text-sm opacity-80'>
        <small>{FOOTER.copy}</small>
        <span className='flex gap-4'><Link to='/privacy' className='underline'>Privacy Policy</Link><Link to='/terms' className='underline'>Terms of Use</Link></span>
      </div>
    </footer>
  );
}
