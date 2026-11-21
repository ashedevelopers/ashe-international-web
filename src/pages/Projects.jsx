import { useEffect, useState } from 'react';
import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, Img, Reveal, Sticker } from '../components/ui.jsx';
import { api } from '../lib/api.js';
import { FEATURED } from '../data/site.js';

function Body() {
  const donate = useDonate();
  const [items, setItems] = useState(null);
  useEffect(() => { api('/projects?status=active&limit=60').then(setItems).catch(() => setItems([])); }, []);
  return (
    <>
      <section className='mx-3.5 my-12 md:mx-7'>
        <Reveal className='grid overflow-hidden rounded-[28px] border-2 border-ashe-ink bg-ashe-yellow md:grid-cols-2'>
          <Img name={FEATURED.image} alt='' className='h-full min-h-[240px] w-full object-cover' />
          <div className='p-6 md:p-10'>
            <Sticker rotate={-3} tone='mint'>Featured campaign</Sticker>
            <h2 className='mt-3 text-4xl md:text-6xl'>{FEATURED.title}</h2>
            <p className='mt-2'>{FEATURED.place}</p>
            <div className='mt-5'><Button onClick={donate}>Donate</Button></div>
          </div>
        </Reveal>
      </section>
      <section className='mx-3.5 my-12 md:mx-7'>
        <h2 className='mb-6 text-center text-[clamp(36px,7vw,76px)]'>Active campaigns</h2>
        {items === null ? <p className='text-center'>Loading campaigns...</p> : items.length === 0 ? (
          <p className='mx-auto max-w-lg text-center'>New campaigns from NGOs, schools and churches will appear here once they are approved. <a className='font-bold underline' href='/start-fundraiser'>Start a fundraiser</a>.</p>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {items.map((p, i) => {
              const pct = p.goal_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.goal_amount) * 100)) : 0;
              return (
                <Reveal key={p.id} i={i % 3}>
                  <article className='h-full overflow-hidden rounded-[28px] border-2 border-ashe-ink bg-white'>
                    {p.image_url && <img src={p.image_url} alt='' loading='lazy' className='aspect-[4/3] w-full object-cover' />}
                    <div className='p-5'>
                      <p className='text-xs font-bold uppercase tracking-wider text-ashe-green'>{p.category}{p.location ? ` · ${p.location}` : ''}</p>
                      <h3 className='mt-1 text-3xl'>{p.title}</h3>
                      {p.story && <p className='mt-2 line-clamp-3 text-[15px]'>{p.story}</p>}
                      <div className='mt-4 h-3 overflow-hidden rounded-full bg-black/10' aria-label={`${pct}% funded`}><div className='h-full rounded-full bg-ashe-green' style={{ width: `${pct}%` }} /></div>
                      <p className='mt-1 text-sm font-semibold'>{Number(p.raised_amount).toLocaleString()} raised of {Number(p.goal_amount).toLocaleString()}</p>
                      <div className='mt-3'><Button tone='yellow' onClick={donate}>Donate</Button></div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function Projects() {
  return (
    <Layout title='Projects' description='Hand-picked campaigns making the biggest impact for refugees and host communities in Uganda.'>
      <PageHeader title='Projects' tone='bg-ashe-mint' tag='Causes' intro='Hand-picked campaigns lighting the way forward for refugees and host communities.' />
      <Body />
    </Layout>
  );
}
