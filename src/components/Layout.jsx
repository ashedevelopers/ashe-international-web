import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

// Shared shell for every public page: navbar, footer, donate modal, cookie notice, per-page title.
export default function Layout({ title, description, children }) {
  usePageMeta(title, description);
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState(null);
  const show = useCallback((id) => { setProject(typeof id === 'string' ? id : null); setOpen(true); }, []);
  const hide = useCallback(() => setOpen(false), []);
  return (
    <DonateCtx.Provider value={show}>
      <Navbar onDonate={show} />
      <main>{children}</main>
      <Footer />
      <DonateModal open={open} onClose={hide} projectId={project} />
      <ScrollTop />
      <CookieBanner />
    </DonateCtx.Provider>
  );
}
