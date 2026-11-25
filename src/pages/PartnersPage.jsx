import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { PartnerCards } from '../components/Partners.jsx';
import { Button, Reveal, Sticker } from '../components/ui.jsx';
import { SITE } from '../data/site.js';

// Partnership content is taken from ASHE's 2026 Annual Report (sections 05 to 07).
const BENEFITS = [
  ['Transparent impact reporting', 'Every sponsorship generates a formal impact report with participant numbers, outputs, photographs and narrative accounts of change.', 'bg-ashe-mint'],
  ['SDG-aligned programming', 'Our work supports the Sustainable Development Goals listed below, from ending poverty and hunger to climate action.', 'bg-ashe-yellow'],
  ['Local credibility', 'ASHE is a lived-experience organisation inside one of East Africa\'s largest refugee settlements, with direct community trust and implementation capacity.', 'bg-ashe-clay'],
];

const SDGS = ['1 · No Poverty', '2 · Zero Hunger', '5 · Gender Equality', '8 · Decent Work', '13 · Climate Action', '15 · Life on Land'];

const BEYOND = [
  ['In-kind sponsorship', 'Direct payment of specific costs, such as sewing machines, seeds, agricultural inputs and tools, without funds passing through ASHE.'],
  ['Media partnership', 'Coverage of ASHE\'s mission with exclusive field access and story leads from Nakivale.'],
  ['Pro-bono professional support', 'Legal, accounting, communications, technology or grant-writing expertise at no cost.'],
];

export default function PartnersPage() {
  return (
    <Layout title='Partners' description='Partner with ASHE: sponsorship, in-kind support, media and pro-bono help for refugees and host communities in Nakivale, Uganda.'>
      <PageHeader title='Our partners' tag='Together' intro='We are proud to work with partners who share our commitment to humanitarian action, and we welcome new ones.' />
      <section className='mx-3.5 my-12 md:mx-7'><PartnerCards /></section>

      <section className='mx-3.5 my-14 md:mx-7'>
        <div className='mb-8 text-center'><Sticker rotate={-4}>Why partner</Sticker><h2 className='mt-3 text-[clamp(36px,7vw,80px)]'>What your partnership makes possible</h2></div>
        <div className='mx-auto grid max-w-5xl gap-3 md:grid-cols-3'>
          {BENEFITS.map(([t, d, tone], i) => <Reveal key={t} i={i} className='h-full'><article className={`h-full rounded-[24px] border-2 border-ashe-ink p-5 ${tone}`}><h3 className='text-3xl'>{t}</h3><p className='mt-2 text-[15px]'>{d}</p></article></Reveal>)}
        </div>
        <div className='mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-2'>{SDGS.map((s) => <span key={s} className='rounded-full border-2 border-ashe-ink bg-white px-4 py-1.5 text-sm font-bold'>SDG {s}</span>)}</div>
      </section>

      <section className='mx-3.5 my-14 md:mx-7'>
        <div className='mb-8 text-center'><Sticker rotate={4}>Flexible</Sticker><h2 className='mt-3 text-[clamp(36px,7vw,80px)]'>Partnership beyond cash</h2><p className='mx-auto mt-3 max-w-xl'>We welcome non-monetary contributions that advance our mission and build mutual capacity.</p></div>
        <div className='mx-auto grid max-w-5xl gap-3 md:grid-cols-3'>
          {BEYOND.map(([t, d], i) => <Reveal key={t} i={i} className='h-full'><article className='h-full rounded-[24px] border-2 border-ashe-ink bg-white p-5'><span className='font-display text-5xl leading-none text-ashe-green'>{i + 1}</span><h3 className='mt-2 text-3xl'>{t}</h3><p className='mt-2 text-[15px]'>{d}</p></article></Reveal>)}
        </div>
      </section>

      <section className='mx-3.5 my-14 md:mx-7'>
        <div className='mx-auto max-w-4xl rounded-[32px] border-2 border-ashe-ink bg-ashe-yellow p-8 text-center md:p-12'>
          <h2 className='text-[clamp(36px,7vw,76px)]'>Ready to build something that lasts?</h2>
          <p className='mx-auto mt-3 max-w-2xl'>Our partners bring resources and expertise; ASHE brings first-hand understanding of displacement, community trust and the capacity to deliver. Expressions of interest are open on a rolling basis.</p>
          <div className='mt-6 flex flex-wrap justify-center gap-3'>
            <Button as={Link} to='/contact'>Get in touch</Button>
            <Button as='a' tone='white' icon='✉' href={`mailto:${SITE.email}`}>{SITE.email}</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
