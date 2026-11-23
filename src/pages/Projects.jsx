import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CampaignCard } from '../components/CampaignKit.jsx';
import { Button, Reveal, Sticker } from '../components/ui.jsx';
import { api } from '../lib/api.js';
import { useCampaign } from '../lib/campaign.js';
import { CAMPAIGN } from '../data/site.js';

function Body() {
  const donate = useDonate();
  const preview = useCampaign();
  const [items, setItems] = useState(null);
  useEffect(() => { api('/projects?status=active&limit=60').then(setItems).catch(() => setItems([])); }, []);
  return (
    <>
      <section className='mx-3.5 my-12 md:mx-7'>
        <div className='grid items-center gap-6 rounded-[32px] border-2 border-ashe-ink bg-ashe-yellow p-5 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8'>
          <Reveal><CampaignCard /></Reveal>
          <Reveal i={1}>
            <Sticker tone='mint' rotate={-3}>Current campaign</Sticker>
            <h2 className='mt-3 text-[clamp(34px,5vw,64px)]'>{CAMPAIGN.short}</h2>
            <p className='mt-3 text-[16px]'>{CAMPAIGN.description}</p>
            <div className='mt-5 flex flex-wrap gap-2.5'>
              <Button onClick={preview}>Preview &amp; donate</Button>
              <Button as='a' tone='white' icon='↗' href={CAMPAIGN.url} target='_blank' rel='noopener noreferrer'>Donate on Zeffy</Button>
            </div>
          </Reveal>
        </div>
      </section>
      <section className='mx-3.5 my-12 md:mx-7'>
        <h2 className='mb-6 text-center text-[clamp(36px,7vw,76px)]'>More campaigns</h2>
        {items === null ? <p className='text-center'>Loading campaigns...</p> : items.length === 0 ? (
          <p className='mx-auto max-w-lg text-center'>New campaigns from NGOs, schools and churches will appear here once they are approved. <Link className='font-bold underline' to='/start-fundraiser'>Start a fundraiser</Link>.</p>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {items.map((p, i) => {
              const pct = p.goal_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.goal_amount) * 100)) : 0;
              return (
                <Reveal key={p.id} i={i % 3} className='h-full'>
                  <article className='h-full overflow-hidden rounded-[28px] border-2 border-ashe-ink bg-white'>
                    <Link to={`/c/${p.slug}`}>{p.image_url && <img src={p.image_url} alt='' loading='lazy' className='aspect-[4/3] w-full object-cover' />}</Link>
                    <div className='p-5'>
                      <p className='text-xs font-bold uppercase tracking-wider text-ashe-green'>{p.category}{p.location ? ` · ${p.location}` : ''}</p>
                      <h3 className='mt-1 text-3xl'><Link to={`/c/${p.slug}`} className='hover:underline'>{p.title}</Link></h3>
                      {p.story && <p className='mt-2 line-clamp-3 text-[15px]'>{p.story}</p>}
                      <div className='mt-4 h-3 overflow-hidden rounded-full bg-black/10' aria-label={`${pct}% funded`}><div className='h-full rounded-full bg-ashe-green' style={{ width: `${pct}%` }} /></div>
                      <p className='mt-1 text-sm font-semibold'>{Number(p.raised_amount).toLocaleString()} raised of {Number(p.goal_amount).toLocaleString()}</p>
                      <div className='mt-3 flex flex-wrap gap-2'><Button as={Link} to={`/c/${p.slug}`}>View</Button><Button tone='yellow' onClick={() => donate(p.id)}>Donate</Button></div>
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
    <Layout title='Projects' description="Support ASHE's current campaign: building a center for refugee women in Nakivale Refugee Settlement, Uganda.">
      <PageHeader title='Projects' tone='bg-ashe-mint' tag='Causes' intro='Our current campaign, and the community campaigns lighting the way forward for refugees and host communities.' />
      <Body />
    </Layout>
  );
}
