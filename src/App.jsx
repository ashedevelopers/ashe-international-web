import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import KineticTicker from './components/KineticTicker.jsx';
import HighlightStrip from './components/HighlightStrip.jsx';
import Programs from './components/Programs.jsx';
import ImpactGallery from './components/ImpactGallery.jsx';
import FAQ from './components/FAQ.jsx';
import Footer, { CtaBand } from './components/Footer.jsx';
import DonateModal from './components/DonateModal.jsx';

function Home() {
  const [donate, setDonate] = useState(false);
  const open = useCallback(() => setDonate(true), []);
  const close = useCallback(() => setDonate(false), []);
  return (
    <>
      <Navbar onDonate={open} />
      <main>
        <Hero onDonate={open} />
        <KineticTicker />
        <HighlightStrip />
        <Programs />
        <ImpactGallery />
        <FAQ />
        <CtaBand onDonate={open} />
      </main>
      <Footer />
      <DonateModal open={donate} onClose={close} />
    </>
  );
}

// Routes for auth and dashboards (ported API) are added in the next step.
export default function App() {
  return <MotionConfig reducedMotion='user'><Home /></MotionConfig>;
}
