import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { Button, Reveal, Sticker } from './ui.jsx';

export const REPORT_TYPES = ['Annual report', 'Impact report', 'Financial report', 'Project report', 'Newsletter', 'Other'];
const TONE = { 'Annual report': 'bg-ashe-yellow', 'Impact report': 'bg-ashe-mint', 'Financial report': 'bg-[#B9DDF2]', 'Project report': 'bg-ashe-clay', Newsletter: 'bg-[#A8E6B5]', Other: 'bg-white' };

// Reports live in site content under the key "reports": { id, title, year, type, summary, url (PDF), cover (image), pages (images of each page) }.
export function useReports() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    api('/content/reports')
      .then((d) => setItems((Array.isArray(d?.value) ? d.value : []).filter((r) => r && r.url && r.title).sort((a, b) => (b.year || 0) - (a.year || 0))))
      .catch(() => setItems([]));
  }, []);
  return items;
}

// Card whose front is the report's cover (first page). Tap it to read the report on the site.
export function ReportCard({ r, onPreview, i = 0 }) {
  const cover = r.cover || r.pages?.[0];
  return (
    <Reveal i={i} className='h-full'>
      <article className='flex h-full flex-col overflow-hidden rounded-[26px] border-2 border-ashe-ink bg-white'>
        <button type='button' onClick={onPreview} aria-label={`Read ${r.title}`} className={`group relative block overflow-hidden ${TONE[r.type] || 'bg-white'} p-5`}>
          <span className='absolute left-3 top-3 z-10'><Sticker rotate={-4}>{r.type}</Sticker></span>
          {cover ? (
            <motion.img src={cover} alt={`Cover of ${r.title}`} loading='lazy' initial={{ rotate: -2 }} whileHover={{ rotate: 0, y: -6, scale: 1.03 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className='mx-auto aspect-[1/1.414] w-[78%] rounded-lg border-2 border-ashe-ink object-cover object-top shadow-[6px_6px_0_0_#0F0F0F]' />
          ) : (
            <motion.span className='grid aspect-[4/3] place-items-center font-display text-[88px] leading-none' whileHover={{ scale: 1.08, rotate: -3 }}>{r.year}</motion.span>
          )}
          <span className='absolute bottom-3 right-3 rounded-full bg-ashe-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white'>{r.year} · PDF</span>
        </button>
        <div className='flex flex-1 flex-col p-5'>
          <h3 className='text-[26px]'>{r.title}</h3>
          {r.summary && <p className='mt-2 line-clamp-3 text-[15px]'>{r.summary}</p>}
          <div className='mt-auto flex flex-wrap gap-2 pt-4'>
            <Button onClick={onPreview} icon='👁'>Read</Button>
            <Button as='a' tone='white' icon='↓' href={r.url} download target='_blank' rel='noopener noreferrer'>Download</Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// Reader: every page is shown as an image, so it works on any phone. Falls back to the PDF viewer if there are no page images.
export function ReportPreview({ report, onClose }) {
  useEffect(() => {
    if (!report) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [report, onClose]);
  const pages = report?.pages || [];
  return (
    <AnimatePresence>
      {report && (
        <motion.div className='fixed inset-0 z-[70] flex items-end justify-center bg-black/70 md:items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()} role='dialog' aria-modal='true' aria-label={`Reading: ${report.title}`}>
          <motion.div className='flex h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-white md:rounded-[28px]' initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
            <header className='flex items-start justify-between gap-3 border-b-2 border-ashe-ink p-4'>
              <div><p className='text-xs font-bold uppercase tracking-wider text-ashe-green'>{report.type} · {report.year}{pages.length ? ` · ${pages.length} pages` : ''}</p><h3 className='text-2xl md:text-3xl'>{report.title}</h3></div>
              <button onClick={onClose} aria-label='Close' className='grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-ashe-ink font-bold'>✕</button>
            </header>
            {pages.length ? (
              <div className='min-h-0 flex-1 space-y-4 overflow-y-auto bg-ashe-mint/40 p-3 md:p-5'>
                {pages.map((src, n) => (
                  <figure key={src} className='mx-auto max-w-2xl'>
                    <img src={src} alt={`${report.title}, page ${n + 1} of ${pages.length}`} loading={n < 2 ? 'eager' : 'lazy'} className='w-full rounded-lg border-2 border-ashe-ink bg-white shadow-[5px_5px_0_0_#0F0F0F]' />
                    <figcaption className='mt-1 text-center text-xs font-bold opacity-60'>Page {n + 1} of {pages.length}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <iframe title={report.title} src={report.url} className='min-h-0 w-full flex-1 bg-ashe-mint/40' />
            )}
            <footer className='flex flex-wrap items-center gap-3 border-t-2 border-ashe-ink p-3'>
              <Button as='a' tone='yellow' icon='↓' href={report.url} download target='_blank' rel='noopener noreferrer'>Download PDF</Button>
              <a className='text-sm font-bold underline' href={report.url} target='_blank' rel='noopener noreferrer'>Open in a new tab</a>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Home-page section: latest annual reports, with a link to every report and publication.
export function ReportsSection() {
  const items = useReports();
  const [open, setOpen] = useState(null);
  const annual = useMemo(() => (items || []).filter((r) => r.type === 'Annual report').slice(0, 3), [items]);
  return (
    <section id='reports' className='mx-3.5 my-16 md:mx-7'>
      <div className='mb-8 text-center'>
        <Sticker rotate={4}>Transparency</Sticker>
        <h2 className='mt-3 text-[clamp(40px,8vw,92px)]'>Annual reports</h2>
        <p className='mx-auto mt-3 max-w-xl'>Read our reports to see our work and how we manage funds and programmes.</p>
      </div>
      {items === null ? null : annual.length > 0 ? (
        <div className={`mx-auto grid max-w-5xl gap-4 ${annual.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-sm'}`}>{annual.map((r, i) => <ReportCard key={r.id || r.title} r={r} i={i} onPreview={() => setOpen(r)} />)}</div>
      ) : (
        <div className='mx-auto max-w-xl rounded-[28px] border-2 border-dashed border-ashe-ink p-8 text-center'>
          <p className='font-display text-3xl uppercase'>Annual reports coming soon</p>
          <p className='mt-2'>Our reports will be published here as soon as they are ready.</p>
        </div>
      )}
      <div className='mt-8 text-center'><Button as={Link} to='/reports' tone='yellow'>View more reports &amp; publications</Button></div>
      <ReportPreview report={open} onClose={() => setOpen(null)} />
    </section>
  );
}
