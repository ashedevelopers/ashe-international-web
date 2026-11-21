import { createContext, useCallback, useContext, useState } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import DonateModal from './DonateModal.jsx';
import CookieBanner from './CookieBanner.jsx';
import { usePageMeta } from '../lib/meta.js';

const DonateCtx = createContext(() => {});
export const useDonate = () => useContext(DonateCtx);

// Shared shell for every public page: navbar, footer, donate modal, cookie notice, per-page title.
export default function Layout({ title, description, children }) {
  usePageMeta(title, description);
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  return (
    <DonateCtx.Provider value={show}>
      <Navbar onDonate={show} />
      <main>{children}</main>
      <Footer />
      <DonateModal open={open} onClose={hide} />
      <CookieBanner />
    </DonateCtx.Provider>
  );
}
