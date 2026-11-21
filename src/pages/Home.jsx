import Layout, { useDonate } from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Pillars from '../components/Pillars.jsx';
import KineticTicker from '../components/KineticTicker.jsx';
import HighlightStrip from '../components/HighlightStrip.jsx';
import Programs from '../components/Programs.jsx';
import ImpactGallery from '../components/ImpactGallery.jsx';
import Partners from '../components/Partners.jsx';
import FAQ from '../components/FAQ.jsx';
import { CtaBand } from '../components/Footer.jsx';
import { Sticker } from '../components/ui.jsx';

// Original photo-led home design. "What makes ASHE different" (Pillars) and "Community impact" (clay gallery band) use the newer card design.
function HomeBody() {
  const donate = useDonate();
  return (
    <>
      <Hero onDonate={donate} />
      <KineticTicker />
      <HighlightStrip />
      <Pillars />
      <Programs />
      <div className='relative mx-3.5 my-16 rounded-[32px] bg-ashe-clay py-8 md:mx-7'>
        <Sticker rotate={6} className='absolute right-4 top-3'>Gallery</Sticker>
        <ImpactGallery />
      </div>
      <Partners />
      <FAQ />
      <CtaBand onDonate={donate} />
    </>
  );
}

export default function Home() {
  return <Layout><HomeBody /></Layout>;
}
