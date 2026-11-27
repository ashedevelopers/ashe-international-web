import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FOOTER } from '../data/asheContent.js';
import { PAGES, SITE } from '../data/site.js';
import { useForceIn } from '../lib/motion.js';
import { Button, Img } from './ui.jsx';
import { Float, Item, Pulse, Stagger } from './Motion.jsx';
import FloatingShapes from './FloatingShapes.jsx';

const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';

// Call-to-action band: the card rises in, the photo drifts with your scroll, the sticker floats, the button pulses.
export function CtaBand({ onDonate }) {
  const ref = useRef(null);
  const forced = useForceIn();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <motion.section ref={ref} className='relative mx-3.5 my-16 overflow-hidden rounded-[32px] px-5 py-16 text-center text-white md:mx-7'
      initial={{ opacity: 0, y: 50, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} animate={forced ? { opacity: 1, y: 0, scale: 1 } : undefined} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
      <motion.div style={{ y }} className='absolute -inset-[10%]'><Img name='families' className='h-full w-full object-cover' /></motion.div>
      <div className='absolute inset-0 bg-ashe-green/90' />
      <div className='relative'>
        <Float amp={6} dur={4}><span className='inline-block rotate-[5deg] border border-ashe-ink bg-ashe-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ashe-ink'>Every gift counts</span></Float>
        <h2 className='mx-auto my-5 max-w-3xl text-[clamp(40px,8vw,92px)]'>Help families stand on their own</h2>
        <Pulse className='inline-block'><Button tone='yellow' onClick={onDonate}>Donate or pledge</Button></Pulse>
      </div>
    </motion.section>
  );
}

const col = 'text-[15px] hover:text-ashe-yellow';

export default function Footer() {
  const forced = useForceIn();
  return (
    <>
      <FloatingShapes />
      <footer className='rounded-t-[32px] bg-ashe-deep px-5 pb-6 pt-9 text-white md:px-12 md:pt-14'>
        <Stagger className='grid gap-8 md:grid-cols-4'>
          <Item>
            <Link to='/' aria-label='ASHE home' className='inline-block rounded-2xl bg-white p-3 transition hover:scale-105'>
              <img src='/images/logo.png' alt='ASHE: Action For Save Humanity in Emergency' className='h-12 w-auto md:h-14'
                onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
            </Link>
            <p className='mt-3 text-sm opacity-80'>Empowering refugees and host communities through training, partnerships and transparent fundraising.</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {SITE.socials.map((s, n) => <motion.a key={s.l} animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: n * 0.3 }} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }} href={s.u} target='_blank' rel='noopener noreferrer' className='rounded-full border border-white/40 px-3 py-1 text-xs font-bold hover:bg-white hover:text-ashe-deep'>{s.l}</motion.a>)}
            </div>
          </Item>
          <Item><nav aria-label='Explore'><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Explore</h4>
            <ul className='grid gap-1.5'>{PAGES.slice(0, 7).map((p) => <li key={p.to}><Link className={col} to={p.to}>{p.l}</Link></li>)}</ul></nav></Item>
          <Item><nav aria-label='Get involved'><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Get involved</h4>
            <ul className='grid gap-1.5'>
              <li><Link className={col} to='/start-fundraiser'>Start a Fundraiser</Link></li>
              <li><Link className={col} to='/volunteer'>Become a Volunteer</Link></li>
              <li><Link className={col} to='/partners'>Become a Partner</Link></li>
              <li><Link className={col} to='/contact'>Contact Us</Link></li>
            </ul></nav></Item>
          <Item><h4 className='mb-2 font-display text-xl uppercase text-ashe-yellow'>Contact</h4>
            <ul className='grid gap-1.5 text-[15px]'>
              <li><a className={col} href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><a className={col} href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li className='opacity-80'>{SITE.address}</li>
            </ul></Item>
        </Stagger>
        <div className='my-8 font-display text-[clamp(70px,20vw,240px)] uppercase leading-[.9] text-ashe-yellow' aria-label={FOOTER.cta.join(' ')}>
          {FOOTER.cta.map((w, k) => (
            <div key={w} aria-hidden='true'>
              {[...w].map((c, i) => (
                <motion.span key={i} className='inline-block' initial={{ opacity: 0, y: '60%' }} whileInView={{ opacity: 1, y: 0 }} animate={forced ? { opacity: 1, y: 0 } : undefined} whileHover={{ y: -12, color: '#ffffff' }} viewport={{ once: true }} transition={{ delay: (i + k * 5) * 0.05, duration: 0.6 }}>
                  <motion.span className='inline-block' animate={{ y: ['0%', '-8%', '0%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: (i + k * 3) * 0.18 }}>{c}</motion.span>
                </motion.span>
              ))}
            </div>
          ))}
        </div>
        <div className='flex flex-wrap items-center justify-between gap-2 text-sm opacity-80'>
          <div className='grid gap-1'>
            <small>{FOOTER.copy}</small>
            <small>Made by <a href='https://wa.me/256771039063' target='_blank' rel='noopener noreferrer' className='underline hover:text-ashe-yellow'>Emmanuel Gabriel Ndayambaje</a></small>
          </div>
          <span className='flex gap-4'><Link to='/privacy' className='underline'>Privacy Policy</Link><Link to='/terms' className='underline'>Terms of Use</Link></span>
        </div>
      </footer>
    </>
  );
}
