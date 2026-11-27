import { useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { Button } from '../components/ui.jsx';
import { DEFAULTS, GROUPS, REGISTRY } from '../data/registry.js';
import { ContentTab } from './tabs.jsx';
import { Panel, chipBtn, inp, lbl, useData } from './kit.jsx';

// Dashboard > Site content: forms for every editable part of the website (built from src/data/registry.js).
const clone = (v) => JSON.parse(JSON.stringify(v));
const isLink = (s) => /^(https?:)?\/\//.test(s) || s.startsWith('/');

function blank(f) {
  if (f.t === 'list' || f.t === 'strings' || f.t === 'numbers') return [];
  if (f.t === 'group') return Object.fromEntries((f.f || []).map((x) => [x.k, blank(x)]));
  if (f.t === 'number') return 0;
  if (f.t === 'bool') return false;
  if (f.t === 'select') return f.o[0].v;
  return '';
}

const Hint = ({ f }) => (f.h ? <p className='mt-1 text-xs opacity-60'>{f.h}</p> : null);

function RowButtons({ i, n, min, move, remove }) {
  return (
    <span className='flex flex-none gap-1'>
      <button type='button' className={chipBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label='Move up'>↑</button>
      <button type='button' className={chipBtn} disabled={i === n - 1} onClick={() => move(i, 1)} aria-label='Move down'>↓</button>
      <button type='button' className={chipBtn} disabled={n <= min} onClick={() => remove(i)}>Remove</button>
    </span>
  );
}

function useListOps(items, onChange) {
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= items.length) return; const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; onChange(c); };
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  return { move, remove };
}

function ImageField({ f, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const v = value ?? '';
  const src = !v ? '' : isLink(v) ? v : `/images/${v}.jpg`;
  async function upload(file) {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('bucket', 'homepage');
      const r = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error?.message || 'Upload failed');
      onChange(j.data.url);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div>
      <label className={lbl}>{f.l}</label>
      <div className='flex items-start gap-3'>
        {src && <img src={src} alt='' className='h-20 w-20 flex-none rounded-lg border-2 border-ashe-ink object-cover' />}
        <div className='min-w-0 flex-1'>
          <input className={inp} value={v} onChange={(e) => onChange(e.target.value)} placeholder='photo name or link' />
          <input type='file' accept='image/*' className='mt-2 w-full text-sm' onChange={(e) => upload(e.target.files?.[0])} />
        </div>
      </div>
      {busy && <p className='mt-1 text-xs'>Uploading...</p>}
      {err && <p className='mt-1 text-xs font-bold text-red-700'>{err}</p>}
      <Hint f={f} />
    </div>
  );
}

function StringList({ f, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const num = f.t === 'numbers';
  const { move, remove } = useListOps(items, onChange);
  return (
    <div className='grid gap-2'>
      {f.l && <label className={lbl}>{f.l}</label>}
      {items.map((it, i) => (
        <div key={i} className='flex items-center gap-2'>
          <input type={num ? 'number' : 'text'} className={`${inp} min-w-0 flex-1`} value={it ?? ''} onChange={(e) => onChange(items.map((x, j) => (j === i ? (num ? Number(e.target.value) || 0 : e.target.value) : x)))} />
          <RowButtons i={i} n={items.length} min={0} move={move} remove={remove} />
        </div>
      ))}
      <div><button type='button' className={chipBtn} onClick={() => onChange([...items, num ? 0 : ''])}>+ Add {f.item || 'item'}</button></div>
    </div>
  );
}

function ItemList({ f, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const { move, remove } = useListOps(items, onChange);
  const first = (f.f || []).find((x) => x.t === 'text');
  return (
    <div className='grid gap-3'>
      {f.l && <label className={lbl}>{f.l}</label>}
      {items.map((it, i) => (
        <div key={i} className='rounded-2xl border-2 border-ashe-ink/40 p-3'>
          <div className='mb-2 flex items-center justify-between gap-2'>
            <b className='min-w-0 truncate text-sm'>{f.item || 'Item'} {i + 1}{first && it?.[first.k] ? `: ${it[first.k]}` : ''}</b>
            <RowButtons i={i} n={items.length} min={f.min || 0} move={move} remove={remove} />
          </div>
          <div className='grid gap-3'>
            {(f.f || []).map((x) => <Field key={x.k} f={x} value={it?.[x.k]} onChange={(nv) => onChange(items.map((y, j) => (j === i ? { ...y, [x.k]: nv } : y)))} />)}
          </div>
        </div>
      ))}
      <div><button type='button' className={chipBtn} onClick={() => onChange([...items, blank({ t: 'group', f: f.f })])}>+ Add {f.item || 'item'}</button></div>
    </div>
  );
}

function Field({ f, value, onChange }) {
  switch (f.t) {
    case 'text': case 'url':
      return <div><label className={lbl}>{f.l}</label><input type={f.t === 'url' ? 'url' : 'text'} className={inp} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /><Hint f={f} /></div>;
    case 'area':
      return <div><label className={lbl}>{f.l}</label><textarea rows={4} className={inp} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /><Hint f={f} /></div>;
    case 'number':
      return <div><label className={lbl}>{f.l}</label><input type='number' className={inp} value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} /></div>;
    case 'bool':
      return <label className='flex items-center gap-2 text-sm font-bold'><input type='checkbox' className='h-5 w-5' checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.l}</label>;
    case 'select':
      return <div><label className={lbl}>{f.l}</label><select className={inp} value={value ?? f.o[0].v} onChange={(e) => onChange(e.target.value)}>{f.o.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
    case 'image':
      return <ImageField f={f} value={value} onChange={onChange} />;
    case 'strings': case 'numbers':
      return <StringList f={f} value={value} onChange={onChange} />;
    case 'list':
      return <ItemList f={f} value={value} onChange={onChange} />;
    case 'group': {
      const v = value && typeof value === 'object' ? value : {};
      return (
        <div className={f.l ? 'rounded-2xl border-2 border-ashe-ink/20 p-3' : ''}>
          {f.l && <p className='mb-2 text-sm font-bold'>{f.l}</p>}
          <div className='grid gap-3'>{(f.f || []).map((x) => <Field key={x.k} f={x} value={v[x.k]} onChange={(nv) => onChange({ ...v, [x.k]: nv })} />)}</div>
        </div>
      );
    }
    default: return null;
  }
}

export default function ContentEditor() {
  const saved = useData('/content');
  const [key, setKey] = useState(null);
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [adv, setAdv] = useState(false);
  const savedMap = useMemo(() => Object.fromEntries((saved.data || []).map((c) => [c.key, c.value])), [saved.data]);
  const e = key ? REGISTRY[key] : null;

  const open = (k) => { setKey(k); setDraft(clone(savedMap[`site.${k}`] ?? DEFAULTS[k])); setMsg(''); };

  async function save(value) {
    const min = e?.root?.min || 0;
    if (Array.isArray(value) && value.length < min) { setMsg(`Keep at least ${min} item.`); return; }
    setBusy(true); setMsg('');
    try {
      await api('/content', { method: 'POST', body: { key: `site.${key}`, value } });
      setMsg('Saved. Visitors see this on their next page load.');
      saved.reload();
    } catch (x) { setMsg(x.message); } finally { setBusy(false); }
  }
  const restore = () => { if (!confirm('Put the original text back for this section?')) return; const d = clone(DEFAULTS[key]); setDraft(d); save(d); };

  return (
    <div className='grid gap-4'>
      <Panel title='Site content' note={saved.err}>
        <p className='mb-3 text-sm opacity-80'>Pick a part of the website, change it, and press Save. A dot means it has been changed from the original.</p>
        {GROUPS.map((g) => (
          <div key={g} className='mb-3'>
            <p className='mb-1 text-xs font-bold uppercase tracking-wider opacity-60'>{g}</p>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(REGISTRY).filter(([, x]) => x.group === g).map(([k, x]) => (
                <button key={k} type='button' className={`${chipBtn} ${key === k ? 'bg-ashe-yellow' : ''}`} onClick={() => open(k)}>{savedMap[`site.${k}`] !== undefined ? '• ' : ''}{x.label}</button>
              ))}
            </div>
          </div>
        ))}
      </Panel>
      {e && draft !== null && (
        <Panel title={e.label}>
          <p className='mb-3 text-sm'>Shown on: <a className='font-bold underline' href={e.page} target='_blank' rel='noopener noreferrer'>{e.page === '/' ? 'Home page' : e.page}</a></p>
          <Field f={e.root} value={draft} onChange={setDraft} />
          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <Button onClick={() => save(draft)} disabled={busy}>{busy ? 'Saving...' : 'Save'}</Button>
            <button type='button' className={chipBtn} onClick={restore}>Restore original</button>
            {msg && <span className='text-sm font-bold'>{msg}</span>}
          </div>
        </Panel>
      )}
      <div>
        <button type='button' className={chipBtn} onClick={() => setAdv(!adv)}>{adv ? 'Hide' : 'Show'} advanced (raw JSON, reports)</button>
        {adv && <div className='mt-3'><ContentTab /></div>}
      </div>
    </div>
  );
}
