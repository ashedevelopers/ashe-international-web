import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CAMPAIGN } from '../data/site.js';
import { useCampaign } from '../lib/campaign.js';
import { Button, Img, Reveal, Sticker } from './ui.jsx';

// Poster-style card for the current campaign. Tapping it opens the preview.
export function CampaignCard({ className = '' }) {
  const open = useCampaign();
  return (
    <motion.button type='button' onClick={open} aria-label={`Preview campaign: ${CAMPAIGN.title}`} initial={{ rotate: -1.5 }} whileHover={{ y: -6, rotate: 0 }} whileTap={{ scale: 0.98 }}
      className={`group relative block w-full overflow-hidden rounded-[28px] border-2 border-ashe-ink text-left ${className}`}>
      <Img name={CAMPAIGN.image} alt='' className='aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105 md:aspect-[16/10]' />
      <div className='absolute inset-0 bg-gradient-to-t from-ashe-deep/95 via-ashe-deep/25 to-transparent' />
      <Sticker rotate={-6} className='absolute left-4 top-4'>Featured campaign</Sticker>
      <div className='absolute inset-x-0 bottom-0 p-5 text-white'>
        <h3 className='text-[clamp(28px,5vw,54px)]'>{CAMPAIGN.title}</h3>
        <p className='mt-1 text-sm opacity-90'>📍 {CAMPAIGN.place}</p>
        <span className='mt-3 inline-flex items-center gap-2 rounded-full bg-ashe-yellow px-4 py-2 text-xs font-bold uppercase tracking-wider text-ashe-ink'>
          Preview &amp; donate <motion.i className='not-italic' animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.i>
        </span>
      </div>
    </motion.button>
  );
}

// Home-page section: the campaign card beside its description.
export function CampaignSpotlight() {
  const open = useCampaign();
  return (
    <section className='mx-3.5 my-16 md:mx-7'>
      <div className='grid items-center gap-6 rounded-[32px] border-2 border-ashe-ink bg-ashe-yellow p-5 md:grid-cols-2 md:gap-10 md:p-8'>
        <Reveal><CampaignCard /></Reveal>
        <Reveal i={1}>
          <Sticker tone='mint' rotate={-3}>Current campaign</Sticker>
          <h2 className='mt-3 text-[clamp(36px,6vw,72px)]'>{CAMPAIGN.title}</h2>
          <p className='mt-3 text-[17px]'>{CAMPAIGN.description}</p>
          <div className='mt-5 flex flex-wrap gap-2.5'>
            <Button onClick={open}>Preview &amp; donate</Button>
            <Button as='a' tone='white' icon='↗' href={CAMPAIGN.url} target='_blank' rel='noopener noreferrer'>Donate on Zeffy</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Sheet({ open, onClose, label, children }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className='fixed inset-0 z-[65] flex items-end justify-center bg-black/65 md:items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()} role='dialog' aria-modal='true' aria-label={label}>
          <motion.div className='max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-[28px] bg-white md:rounded-[28px]' initial={{ y: 70, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 70, opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CampaignBody({ onClose, note }) {
  return (
    <>
      <div className='relative'>
        <Img name={CAMPAIGN.image} alt='' loading='eager' className='aspect-[16/9] w-full object-cover' />
        <button onClick={onClose} aria-label='Close' className='absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white font-bold shadow'>✕</button>
      </div>
      <div className='p-6'>
        <Sticker rotate={-3}>Featured campaign</Sticker>
        <h3 className='mt-3 text-4xl md:text-5xl'>{CAMPAIGN.title}</h3>
        <p className='mt-1 text-sm font-semibold text-ashe-green'>📍 {CAMPAIGN.place}</p>
        <p className='mt-3 text-[16px] leading-relaxed'>{CAMPAIGN.description}</p>
        <div className='mt-5 flex flex-wrap items-center gap-3'>
          <Button as='a' tone='yellow' icon='↗' href={CAMPAIGN.url} target='_blank' rel='noopener noreferrer' onClick={note}>Donate on Zeffy</Button>
          <button onClick={onClose} className='text-sm font-bold underline'>Close</button>
        </div>
        <p className='mt-3 text-xs opacity-70'>You will leave this site to give securely on Zeffy. This link is for this campaign only.</p>
      </div>
    </>
  );
}

// Preview opened by tapping the campaign card: title, description, and the Zeffy donate link.
export function CampaignPreview({ open, onClose }) {
  return <Sheet open={open} onClose={onClose} label='Campaign preview'><CampaignBody onClose={onClose} /></Sheet>;
}

const SECONDS = 'ashe_site_seconds';
const UNTIL = 'ashe_campaign_popup_until';

// After 40 seconds on the site (counted across pages in this visit) the home page shows a campaign pop-up.
// Closing or donating hides it for 3 days.
export function CampaignPopup() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        if ((Number(localStorage.getItem(UNTIL)) || 0) > Date.now()) return;
        if (pathname === '/' && (Number(sessionStorage.getItem(SECONDS)) || 0) >= 40) setShow(true);
      } catch { /* storage blocked: no pop-up */ }
    };
    check();
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      try { sessionStorage.setItem(SECONDS, String((Number(sessionStorage.getItem(SECONDS)) || 0) + 1)); } catch { /* ignore */ }
      check();
    }, 1000);
    return () => clearInterval(id);
  }, [pathname]);

  const dismiss = () => { try { localStorage.setItem(UNTIL, String(Date.now() + 3 * 86400000)); } catch { /* ignore */ } setShow(false); };
  return <Sheet open={show} onClose={dismiss} label='Support our current campaign'><CampaignBody onClose={dismiss} note={dismiss} /></Sheet>;
}
