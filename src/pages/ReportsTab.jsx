import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { Button } from '../components/ui.jsx';
import { REPORT_TYPES } from '../components/ReportKit.jsx';
import { Panel, Table, chipBtn, inp, lbl } from './kit.jsx';

// Dashboard > Reports (admin, designer): add or remove reports. A PDF can be uploaded (needs file storage) or linked.
// Reports added here are read in a PDF viewer; ones with page images (like the first two) open as a scrolling reader.
export default function ReportsTab() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [f, setF] = useState({ title: '', year: new Date().getFullYear(), type: 'Annual report', summary: '', url: '', cover: '' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { api('/content/reports').then((d) => setItems(Array.isArray(d?.value) ? d.value : [])).catch(() => setItems([])); }, []);
  const save = (list) => api('/content', { method: 'POST', body: { key: 'reports', value: list } });

  async function add(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      let url = f.url.trim();
      if (file) {
        const fd = new FormData();
        fd.append('file', file); fd.append('bucket', 'reports');
        const r = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.error?.message || 'Upload failed');
        url = j.data.url;
      }
      if (!url) throw new Error('Choose a PDF file or paste a link to one.');
      const item = { id: crypto.randomUUID(), title: f.title.trim(), year: Number(f.year) || new Date().getFullYear(), type: f.type, summary: f.summary.trim(), url, cover: f.cover.trim() || undefined };
      const next = [item, ...items];
      await save(next);
      setItems(next); setFile(null); setF((p) => ({ ...p, title: '', summary: '', url: '', cover: '' }));
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  async function remove(id) {
    const next = items.filter((r) => r.id !== id);
    try { await save(next); setItems(next); } catch (x) { setErr(x.message); }
  }

  return (
    <div className='grid gap-4'>
      <Panel title='Add a report' note={err}>
        <form onSubmit={add}>
          <label className={lbl}>Title</label><input required className={inp} value={f.title} onChange={set('title')} placeholder='Annual Report 2027' />
          <div className='grid gap-3 md:grid-cols-2'>
            <div><label className={lbl}>Type</label><select className={inp} value={f.type} onChange={set('type')}>{REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className={lbl}>Year</label><input type='number' min='2000' max='2100' className={inp} value={f.year} onChange={set('year')} /></div>
          </div>
          <label className={lbl}>Short summary (optional)</label><textarea rows={3} className={inp} value={f.summary} onChange={set('summary')} />
          <label className={lbl}>PDF file (uploads need file storage turned on)</label><input type='file' accept='application/pdf' className={inp} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label className={lbl}>Or paste a link to the PDF</label><input type='url' className={inp} value={f.url} onChange={set('url')} placeholder='https://...' />
          <label className={lbl}>Cover image link (optional: first page as a picture)</label><input type='url' className={inp} value={f.cover} onChange={set('cover')} placeholder='https://... or /report-files/...jpg' />
          <div className='mt-4'><Button type='submit' disabled={busy || items === null}>{busy ? 'Saving...' : 'Add report'}</Button></div>
        </form>
      </Panel>
      <Panel title='Published reports'>
        <Table cols={['Year', 'Type', 'Title', '']} rows={(items || []).map((r) => [r.year, r.type, r.title, <button key={r.id} className={chipBtn} onClick={() => confirm('Remove this report from the website?') && remove(r.id)}>Remove</button>])} empty='No reports yet.' />
      </Panel>
    </div>
  );
}
