import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { animate, motion, scroll, useScroll, useSpring } from 'framer-motion';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import DonateModal from './DonateModal.jsx';
import CookieBanner from './CookieBanner.jsx';
import { usePageMeta } from '../lib/meta.js';

const DonateCtx = createContext(() => {});
// donate() opens the modal; donate(projectId) gives to one campaign.
export const useDonate = () => useContext(DonateCtx);

function ScrollTop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > 700);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return on ? <button aria-label='Back to top' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='fixed bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full border-2 border-ashe-yellow bg-ashe-ink text-lg text-white shadow-lg'>↑</button> : null;
}

// Thin yellow reading-progress bar at the very top of the page.
function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden='true' style={{ scaleX }} className='fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-ashe-yellow' />;
}

// Scroll-scrubbed motion for every section title on the page: each h2 slides in and fades up as you scroll it into view,
// and moves back if you scroll up. It follows your finger, so it is visible on every device.
function useScrollMotion() {
  useEffect(() => {
    const stops = [];
    const t = setTimeout(() => {
      try {
        document.querySelectorAll('main h2').forEach((el, n) => {
          stops.push(scroll(animate(el, { opacity: [0, 1], x: [n % 2 ? 80 : -80, 0] }, { ease: 'easeOut' }), { target: el, offset: ['start end', 'start 70%'] }));
        });
      } catch (e) { console.warn('Scroll motion unavailable', e); }
    }, 500);
    return () => { clearTimeout(t); stops.forEach((s) => { try { s(); } catch { /* ignore */ } }); };
  }, []);
}

// Shared shell for every public page: navbar, footer, donate modal, cookie notice, per-page title, page-enter animation.
export default function Layout({ title, description, children }) {
  usePageMeta(title, description);
  useScrollMotion();
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState(null);
  const show = useCallback((id) => { setProject(typeof id === 'string' ? id : null); setOpen(true); }, []);
  const hide = useCallback(() => setOpen(false), []);
  return (
    <DonateCtx.Provider value={show}>
      <Progress />
      <Navbar onDonate={show} />
      <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>{children}</motion.main>
      <Footer />
      <DonateModal open={open} onClose={hide} projectId={project} />
      <ScrollTop />
      <CookieBanner />
    </DonateCtx.Provider>
  );
}
