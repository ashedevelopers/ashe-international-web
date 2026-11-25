import Layout, { useDonate } from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Pillars from '../components/Pillars.jsx';
import KineticTicker from '../components/KineticTicker.jsx';
import HighlightStrip from '../components/HighlightStrip.jsx';
import YearGlance from '../components/YearGlance.jsx';
import MottoBand from '../components/MottoBand.jsx';
import Values from '../components/Values.jsx';
import Programs from '../components/Programs.jsx';
import ImpactGallery from '../components/ImpactGallery.jsx';
import Partners from '../components/Partners.jsx';
import FAQ from '../components/FAQ.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { CampaignSpotlight } from '../components/CampaignKit.jsx';
import { ReportsSection } from '../components/ReportKit.jsx';
import { CtaBand } from '../components/Footer.jsx';
import { Sticker } from '../components/ui.jsx';

// Home: hero, ticker, current campaign, story, 2026 at a glance, motto, pillars, focus areas, values, gallery, annual reports, partners, FAQ, newsletter, call to action.
function HomeBody() {
  const donate = useDonate();
  return (
    <>
      <Hero onDonate={donate} />
      <KineticTicker />
      <CampaignSpotlight />
      <HighlightStrip />
      <YearGlance />
      <MottoBand />
      <Pillars />
      <Programs />
      <Values />
      <div className='relative mx-3.5 my-16 rounded-[32px] bg-ashe-clay py-8 md:mx-7'>
        <Sticker rotate={6} className='absolute right-4 top-3'>Gallery</Sticker>
        <ImpactGallery />
      </div>
      <ReportsSection />
      <Partners />
      <FAQ />
      <Newsletter />
      <CtaBand onDonate={donate} />
    </>
  );
}

export default function Home() {
  return <Layout><HomeBody /></Layout>;
}
