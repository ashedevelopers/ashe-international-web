import { Link } from 'react-router-dom';
import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Programs from '../components/Programs.jsx';
import { CtaBand } from '../components/Footer.jsx';
import { Button, Reveal, Sticker } from '../components/ui.jsx';

// Programme areas and 2026 outputs are taken from the 2026 Annual Report.
const AREAS = [
  ['1. Environment', 'Reforestation and tree nurseries; seedling nursery management', '2,500 seedlings raised and distributed to 120 households and 3 schools', 'bg-ashe-mint'],
  ['2. Vocational skills', 'Sewing, tailoring and livestock training', '40 trainees; 25 earning income', 'bg-ashe-yellow'],
  ['3. Food security', 'Sustainable agriculture and market gardening', '60 households trained; 2 produce distribution events', 'bg-[#B9DDF2]'],
  ['4. Nutrition', 'Kitchen garden programme', '90 household gardens established', 'bg-ashe-clay'],
  ['5. Livelihoods', 'Poultry, goat and small animal husbandry', '100 birds to 40 households; 50 goats to 5 groups on a pass-on model', 'bg-[#A8E6B5]'],
  ['6. Capacity and digital literacy', 'Staff development with InnovYeng; youth digital skills', '12+ staff certified; 30 youth trained', 'bg-ashe-mint'],
];

function Body() {
  const donate = useDonate();
  return (
    <>
      <Programs />
      <section className='mx-3.5 my-14 md:mx-7'>
        <div className='mb-8 text-center'><Sticker rotate={-4}>2026 results</Sticker><h2 className='mt-3 text-[clamp(36px,7vw,80px)]'>Programme areas and outputs</h2></div>
        <div className='mx-auto grid max-w-5xl gap-3 md:grid-cols-2'>
          {AREAS.map(([t, a, o, tone], i) => (
            <Reveal key={t} i={i % 2} className='h-full'>
              <article className={`h-full rounded-[24px] border-2 border-ashe-ink p-5 ${tone}`}>
                <h3 className='text-3xl'>{t}</h3>
                <p className='mt-1 text-[15px]'>{a}</p>
                <p className='mt-3 rounded-xl bg-white/70 p-3 text-[15px] font-semibold'>2026 output: {o}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className='mt-6 text-center'><Link to='/reports' className='font-bold underline'>Read the full Annual Report</Link></p>
      </section>
      <CtaBand onDonate={donate} />
    </>
  );
}

export default function ProgramsPage() {
  return (
    <Layout title='Programs' description='ASHE focus areas and 2026 programme outputs: agriculture and food security, climate action, livelihoods, vocational and digital skills, family support and WASH.'>
      <PageHeader title='Our programs' tone='bg-ashe-yellow' tag='What we do' intro='Seven focus areas, with youth and women at the centre of every programme, and the results they delivered in 2026.' />
      <Body />
    </Layout>
  );
}
