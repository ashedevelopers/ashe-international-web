import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { Button, Reveal, Sticker } from './ui.jsx';

export const REPORT_TYPES = ['Annual report', 'Impact report', 'Financial report', 'Project report', 'Newsletter', 'Other'];
const TONE = { 'Annual report': 'bg-ashe-yellow', 'Impact report': 'bg-ashe-mint', 'Financial report': 'bg-[#B9DDF2]', 'Project report': 'bg-ashe-clay', Newsletter: 'bg-[#A8E6B5]', Other: 'bg-white' };

// Reports are managed in the dashboard (Reports tab) and stored as site content under the key "reports".
export function useReports() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    api('/content/reports')
      .then((d) => setItems((Array.isArray(d?.value) ? d.value : []).filter((r) => r && r.url && r.title).sort((a, b) => (b.year || 0) - (a.year || 0))))
      .catch(() => setItems([]));
  }, []);
  return items;
}

export function ReportCard({ r, onPreview, i = 0 }) {
  return (
    <Reveal i={i} className='h-full'>
      <article className='flex h-full flex-col overflow-hidden rounded-[26px] border-2 border-ashe-ink bg-white'>
        <button type='button' onClick={onPreview} aria-label={`Preview ${r.title}`} className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${TONE[r.type] || 'bg-white'}`}>
          <span className='absolute left-3 top-3'><Sticker rotate={-4}>{r.type}</Sticker></span>
          <motion.span className='font-display text-[88px] leading-none' whileHover={{ scale: 1.08, rotate: -3 }}>{r.year}</motion.span>
          <span className='absolute bottom-3 right-3 rounded-full bg-ashe-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white'>PDF</span>
        </button>
        <div className='flex flex-1 flex-col p-5'>
          <h3 className='text-[26px]'>{r.title}</h3>
          {r.summary && <p className='mt-2 line-clamp-3 text-[15px]'>{r.summary}</p>}
          <div className='mt-auto flex flex-wrap gap-2 pt-4'>
            <Button onClick={onPreview} icon='👁'>Preview</Button>
            <Button as='a' tone='white' icon='↓' href={r.url} download target='_blank' rel='noopener noreferrer'>Download</Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// Full-screen reader: the report opens on the website, with Download and Open buttons underneath.
export function ReportPreview({ report, onClose }) {
  useEffect(() => {
    if (!report) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [report, onClose]);
  return (
    <AnimatePresence>
      {report && (
        <motion.div className='fixed inset-0 z-[70] flex items-end justify-center bg-black/70 md:items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()} role='dialog' aria-modal='true' aria-label={`Preview: ${report.title}`}>
          <motion.div className='flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] bg-white md:rounded-[28px]' initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
            <header className='flex items-start justify-between gap-3 border-b-2 border-ashe-ink p-4'>
              <div><p className='text-xs font-bold uppercase tracking-wider text-ashe-green'>{report.type} · {report.year}</p><h3 className='text-2xl md:text-3xl'>{report.title}</h3></div>
              <button onClick={onClose} aria-label='Close' className='grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-ashe-ink font-bold'>✕</button>
            </header>
            <iframe title={report.title} src={report.url} className='min-h-0 w-full flex-1 bg-ashe-mint/40' />
            <footer className='flex flex-wrap items-center gap-3 border-t-2 border-ashe-ink p-3'>
              <Button as='a' tone='yellow' icon='↓' href={report.url} download target='_blank' rel='noopener noreferrer'>Download</Button>
              <a className='text-sm font-bold underline' href={report.url} target='_blank' rel='noopener noreferrer'>Open in a new tab</a>
              <span className='text-xs opacity-70'>If you only see one page on your phone, use Open or Download.</span>
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
        <div className='mx-auto grid max-w-5xl gap-4 md:grid-cols-3'>{annual.map((r, i) => <ReportCard key={r.id || r.title} r={r} i={i} onPreview={() => setOpen(r)} />)}</div>
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
