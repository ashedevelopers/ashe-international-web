import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, Reveal, Sticker } from '../components/ui.jsx';
import { api } from '../lib/api.js';
import { day } from './kit.jsx';

function Body({ p, milestones, supporters }) {
  const donate = useDonate();
  const [copied, setCopied] = useState(false);
  const pct = p.goal_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.goal_amount) * 100)) : 0;
  const share = async () => {
    const url = window.location.href;
    try { if (navigator.share) await navigator.share({ title: p.title, url }); else { await navigator.clipboard.writeText(url); setCopied(true); } } catch { /* cancelled */ }
  };
  return (
    <div className='mx-3.5 my-10 grid gap-5 md:mx-7 lg:grid-cols-[1.6fr_1fr]'>
      <div>
        {p.image_url && <img src={p.image_url} alt='' className='aspect-[16/10] w-full rounded-[28px] border-2 border-ashe-ink object-cover' />}
        <h2 className='mt-6 text-4xl md:text-5xl'>The story</h2>
        <div className='mt-3 space-y-3 text-[17px]'>{(p.story || 'Details about this campaign are coming soon.').split(/\n+/).map((t, i) => <p key={i}>{t}</p>)}</div>
        {milestones.length > 0 && (
          <>
            <h2 className='mt-8 text-4xl md:text-5xl'>Milestones</h2>
            <ol className='mt-3 grid gap-2.5'>
              {milestones.map((m) => (
                <li key={m.id} className='rounded-[18px] border-2 border-ashe-ink bg-white p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-2'><b>{m.position}. {m.title}</b><Sticker rotate={0} tone={m.status === 'completed' ? 'mint' : 'yellow'}>{m.status}</Sticker></div>
                  {m.description && <p className='mt-1 text-[15px]'>{m.description}</p>}
                  {m.amount > 0 && <p className='mt-1 text-sm font-semibold'>Target {Number(m.amount).toLocaleString()}</p>}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <aside className='grid content-start gap-4'>
        <Reveal className='rounded-[28px] border-2 border-ashe-ink bg-ashe-yellow p-6'>
          <p className='font-display text-5xl leading-none'>{Number(p.raised_amount).toLocaleString()}</p>
          <p className='mt-1 text-sm font-semibold'>raised of {Number(p.goal_amount).toLocaleString()} goal</p>
          <div className='mt-4 h-4 overflow-hidden rounded-full bg-white' aria-label={`${pct}% funded`}><div className='h-full rounded-full bg-ashe-green transition-all duration-1000' style={{ width: `${pct}%` }} /></div>
          <p className='mt-2 text-sm'>{pct}% funded · {p.donor_count} supporter{p.donor_count === 1 ? '' : 's'}</p>
          <div className='mt-5 grid gap-2'>
            <Button onClick={() => donate(p.id)} className='justify-between'>Donate to this campaign</Button>
            <Button tone='white' icon='↗' onClick={share} className='justify-between'>{copied ? 'Link copied' : 'Share'}</Button>
          </div>
        </Reveal>
        <Reveal i={1} className='rounded-[28px] border-2 border-ashe-ink bg-white p-6'>
          <h3 className='text-3xl'>Recent supporters</h3>
          {supporters.length === 0 ? <p className='mt-2 text-sm'>Be the first to give.</p> : (
            <ul className='mt-3 grid gap-2'>{supporters.slice(0, 8).map((s) => <li key={s.id} className='flex items-start justify-between gap-3 border-b border-black/10 pb-2 text-sm'><span><b>{s.is_anonymous || !s.donor_name ? 'Anonymous' : s.donor_name}</b>{s.message ? <i className='block opacity-70'>"{s.message}"</i> : null}</span><span className='whitespace-nowrap text-right'>{Number(s.amount).toLocaleString()}<br /><small className='opacity-60'>{day(s.created_at)}</small></span></li>)}</ul>
          )}
        </Reveal>
      </aside>
    </div>
  );
}

// /c/:slug: public campaign page (matches the links in /sitemap.xml).
export default function Campaign() {
  const { slug } = useParams();
  const [state, setState] = useState({ p: undefined, milestones: [], supporters: [] });
  useEffect(() => {
    let live = true;
    setState({ p: undefined, milestones: [], supporters: [] });
    api(`/projects/slug/${encodeURIComponent(slug)}`).then(async (p) => {
      const [milestones, supporters] = await Promise.all([
        api(`/project_milestones?project_id=${p.id}`).catch(() => []),
        api(`/donations?project_id=${p.id}`).catch(() => []),
      ]);
      if (live) setState({ p, milestones, supporters });
    }).catch(() => live && setState({ p: null, milestones: [], supporters: [] }));
    return () => { live = false; };
  }, [slug]);
  const { p } = state;
  return (
    <Layout title={p ? p.title : 'Campaign'} description={p?.story ? p.story.slice(0, 155) : 'An ASHE International campaign supporting refugees and host communities in Uganda.'}>
      {p === undefined && <p className='p-16 text-center'>Loading campaign...</p>}
      {p === null && (
        <div className='p-16 text-center'><h1 className='text-6xl'>Campaign not found</h1><p className='mt-3'>It may have ended or is not published yet.</p><Link to='/projects' className='mt-4 inline-block font-bold underline'>See all projects</Link></div>
      )}
      {p && (
        <>
          <PageHeader title={p.title} tone='bg-ashe-mint' tag={p.category || 'Campaign'} intro={p.location ? `📍 ${p.location}` : undefined} />
          <Body p={p} milestones={state.milestones} supporters={state.supporters} />
        </>
      )}
    </Layout>
  );
}
