import { useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { REPORT_TYPES, ReportCard, ReportPreview, useReports } from '../components/ReportKit.jsx';

// /reports: every report and publication, filterable by type and year.
export default function Reports() {
  const items = useReports();
  const [type, setType] = useState('All');
  const [year, setYear] = useState('All');
  const [open, setOpen] = useState(null);
  const years = useMemo(() => [...new Set((items || []).map((r) => r.year))].sort((a, b) => b - a), [items]);
  const types = useMemo(() => REPORT_TYPES.filter((t) => (items || []).some((r) => r.type === t)), [items]);
  const shown = (items || []).filter((r) => (type === 'All' || r.type === type) && (year === 'All' || String(r.year) === year));
  const chip = (on) => `rounded-full border-2 border-ashe-ink px-4 py-2 text-[13px] font-bold transition ${on ? 'bg-ashe-ink text-white' : 'bg-white'}`;
  return (
    <Layout title='Reports & Publications' description='Read and download ASHE annual reports, impact reports, financial reports and other publications.'>
      <PageHeader title='Reports & Publications' tone='bg-ashe-yellow' tag='Transparency' intro='Annual reports, impact updates, financial statements and more. Read them here or download a copy.' />
      <section className='mx-3.5 my-12 md:mx-7'>
        {items === null ? <p className='text-center'>Loading reports...</p> : items.length === 0 ? (
          <div className='mx-auto max-w-xl rounded-[28px] border-2 border-dashed border-ashe-ink p-8 text-center'>
            <p className='font-display text-4xl uppercase'>Reports coming soon</p>
            <p className='mt-2'>Annual reports, impact reports and other publications will appear here once they are published.</p>
          </div>
        ) : (
          <>
            <div className='mb-6 flex flex-wrap items-center justify-center gap-2' role='tablist' aria-label='Filter reports'>
              {['All', ...types].map((t) => <button key={t} role='tab' aria-selected={type === t} onClick={() => setType(t)} className={chip(type === t)}>{t}</button>)}
              <select aria-label='Filter by year' value={year} onChange={(e) => setYear(e.target.value)} className='rounded-full border-2 border-ashe-ink bg-white px-4 py-2 text-[13px] font-bold'>
                <option value='All'>All years</option>{years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            {shown.length === 0 ? <p className='text-center'>No reports match this filter.</p> : (
              <div className='mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>{shown.map((r, i) => <ReportCard key={r.id || r.title} r={r} i={i % 3} onPreview={() => setOpen(r)} />)}</div>
            )}
          </>
        )}
      </section>
      <ReportPreview report={open} onClose={() => setOpen(null)} />
    </Layout>
  );
}
