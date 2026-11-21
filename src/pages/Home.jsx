import Layout, { useDonate } from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import KineticTicker from '../components/KineticTicker.jsx';
import HighlightStrip from '../components/HighlightStrip.jsx';
import Programs from '../components/Programs.jsx';
import ImpactGallery from '../components/ImpactGallery.jsx';
import Partners from '../components/Partners.jsx';
import FAQ from '../components/FAQ.jsx';
import { CtaBand } from '../components/Footer.jsx';

function HomeBody() {
  const donate = useDonate();
  return (
    <>
      <Hero onDonate={donate} />
      <KineticTicker />
      <HighlightStrip />
      <Programs />
      <ImpactGallery />
      <Partners />
      <FAQ />
      <CtaBand onDonate={donate} />
    </>
  );
}

export default function Home() {
  return <Layout><HomeBody /></Layout>;
}
