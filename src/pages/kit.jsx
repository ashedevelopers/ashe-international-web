import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export const inp = 'w-full rounded-xl border-2 border-ashe-ink bg-white p-3 text-base';
export const lbl = 'mb-1 mt-3 block text-xs font-bold uppercase tracking-wider';
export const chipBtn = 'rounded-full border-2 border-ashe-ink px-3 py-1 text-xs font-bold hover:bg-ashe-ink hover:text-ashe-cream disabled:opacity-40';

export function useData(path) {
  const [s, setS] = useState({ data: null, err: '', loading: true });
  const load = useCallback(() => {
    setS((p) => ({ ...p, loading: true }));
    return api(path).then((data) => setS({ data, err: '', loading: false })).catch((e) => setS({ data: null, err: e.message, loading: false }));
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { ...s, reload: load };
}

export function Panel({ title, children, note }) {
  return (
    <section className='rounded-[24px] border-2 border-ashe-ink bg-white p-4 md:p-6'>
      {title && <h3 className='mb-3 text-2xl'>{title}</h3>}
      {note && <p role='alert' className='mb-3 text-sm font-semibold text-red-700'>{note}</p>}
      {children}
    </section>
  );
}

export function Table({ cols, rows, empty = 'Nothing here yet.' }) {
  if (!rows?.length) return <p className='text-sm opacity-70'>{empty}</p>;
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[560px] text-left text-sm'>
        <thead><tr>{cols.map((c) => <th key={c} className='border-b-2 border-ashe-ink px-2 py-2 text-xs uppercase tracking-wider'>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className='border-b border-black/10 align-top'>{r.map((c, j) => <td key={j} className='px-2 py-2'>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export const money = (a, c = 'USD') => `${c} ${Number(a || 0).toLocaleString()}`;
export const day = (s) => (s ? String(s).slice(0, 10) : '');
