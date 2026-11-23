import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Programs from '../components/Programs.jsx';
import MottoBand from '../components/MottoBand.jsx';
import Values from '../components/Values.jsx';
import { CtaBand } from '../components/Footer.jsx';
import { Img, Reveal, Sticker } from '../components/ui.jsx';
import { FOCUS_NOTE, MISSION, OBJECTIVES, VISION } from '../data/about.js';
import { TEAM } from '../data/site.js';

const Wrap = ({ children, className = '' }) => <section className={`mx-3.5 my-14 md:mx-7 ${className}`}>{children}</section>;

function Cta() { const d = useDonate(); return <CtaBand onDonate={d} />; }

export default function About() {
  return (
    <Layout title='About Us' description='ASHE mission, vision, motto, core values, objectives and focus areas: equipping refugees and displaced people, especially youth and women, to feed their families, earn an income and lead their own recovery.'>
      <PageHeader title='About ASHE' tag='Our story' intro='Action For Save Humanity in Emergency equips refugees, displaced people and marginalised groups to lead their own recovery.' />
      <Wrap className='grid gap-4 md:grid-cols-2'>
        {[['Our mission', MISSION, 'bg-ashe-mint', 'team'], ['Our vision', VISION, 'bg-ashe-yellow', 'community']].map(([k, v, tone, img], i) => (
          <Reveal key={k} i={i} className={`overflow-hidden rounded-[28px] border-2 border-ashe-ink ${tone}`}>
            <Img name={img} alt='' className='aspect-[16/10] w-full object-cover' />
            <div className='p-6'><Sticker rotate={-3}>{k}</Sticker><p className='mt-4 text-[18px] leading-relaxed'>{v}</p></div>
          </Reveal>
        ))}
      </Wrap>
      <MottoBand />
      <Values />
      <Wrap>
        <h2 className='mb-8 text-center text-[clamp(38px,8vw,92px)]'>Our objectives</h2>
        <ol className='mx-auto grid max-w-5xl gap-3 md:grid-cols-2'>
          {OBJECTIVES.map((o, i) => (
            <Reveal key={o} i={i % 2} className='h-full'>
              <li className='flex h-full gap-4 rounded-[22px] border-2 border-ashe-ink bg-white p-4'>
                <span className='font-display text-4xl leading-none text-ashe-green'>{String(i + 1).padStart(2, '0')}</span>
                <span className='text-[16px]'>{o}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Wrap>
      <Wrap><p className='mx-auto max-w-3xl rounded-[24px] bg-ashe-yellow p-5 text-center font-display text-3xl uppercase md:text-5xl'>{FOCUS_NOTE}</p></Wrap>
      <Programs />
      <Wrap>
        <h2 className='mb-6 text-center text-[clamp(40px,8vw,92px)]'>Meet the team</h2>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          {TEAM.map((m, i) => (
            <Reveal key={m.id} i={i % 4} className='h-full'>
              <article className='h-full overflow-hidden rounded-[24px] border-2 border-ashe-ink bg-white'>
                <Img name={`team/${m.id}`} alt={m.name} className='aspect-square w-full object-cover' />
                <div className='p-3.5'><h3 className='text-xl'>{m.name}</h3><p className='mt-1 text-[13px] opacity-80'>{m.role}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </Wrap>
      <Cta />
    </Layout>
  );
}
