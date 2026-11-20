import { useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { Button } from '../components/ui.jsx';
import { Panel, Table, chipBtn, day, inp, lbl, money, useData } from './kit.jsx';

const ROLES = ['admin', 'designer', 'finance', 'partner', 'donor', 'fundraiser'];
const STATUS = ['draft', 'pending', 'active', 'funded', 'closed'];

function useAct(reloads) {
  const [err, setErr] = useState('');
  const run = async (fn) => { try { setErr(''); await fn(); reloads.forEach((r) => r()); } catch (e) { setErr(e.message); } };
  return [err, run];
}

export function UsersTab() {
  const users = useData('/users'); const roles = useData('/roles');
  const [err, run] = useAct([users.reload, roles.reload]);
  const [f, setF] = useState({ email: '', role: 'designer' });
  const emailOf = Object.fromEntries((users.data || []).map((u) => [u.id, u.email]));
  return (
    <div className='grid gap-4'>
      <Panel title='Assign a role' note={err || users.err}>
        <form className='flex flex-wrap items-end gap-2' onSubmit={(e) => { e.preventDefault(); run(() => api('/roles', { method: 'POST', body: f })); }}>
          <div className='min-w-[220px] flex-1'><label className={lbl}>User email</label><input required type='email' className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><label className={lbl}>Role</label><select className={inp} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
          <Button type='submit'>Assign</Button>
        </form>
      </Panel>
      <Panel title='Staff roles'>
        <Table cols={['User', 'Role', '']} rows={(roles.data || []).map((r) => [emailOf[r.user_id] || r.user_id, r.role, <button key={r.id} className={chipBtn} onClick={() => run(() => api(`/roles/${r.id}`, { method: 'DELETE' }))}>Remove</button>])} />
      </Panel>
      <Panel title='All users'>
        <Table cols={['Email', 'Name', 'Roles', 'Joined', 'Active']} rows={(users.data || []).map((u) => [u.email, u.display_name, u.roles.join(', '), day(u.created_at),
          <button key={u.id} className={chipBtn} onClick={() => run(() => api(`/users/${u.id}`, { method: 'PATCH', body: { is_active: u.is_active ? 0 : 1 } }))}>{u.is_active ? 'Deactivate' : 'Activate'}</button>])} />
      </Panel>
    </div>
  );
}

export function ProjectsTab() {
  const { has } = useAuth();
  const d = useData('/projects?limit=300'); const [err, run] = useAct([d.reload]);
  const patch = (id, body) => run(() => api(`/projects/${id}`, { method: 'PATCH', body }));
  return (
    <Panel title='Campaigns' note={err || d.err}>
      <Table cols={['Title', 'Status', 'Raised / goal', 'Flags', '']} rows={(d.data || []).map((p) => [p.title,
        <select key='s' className='rounded-lg border-2 border-ashe-ink p-1' value={p.status} onChange={(e) => patch(p.id, { status: e.target.value })}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>,
        `${Number(p.raised_amount).toLocaleString()} / ${Number(p.goal_amount).toLocaleString()}`,
        <div key='f' className='flex flex-wrap gap-1'>{['is_promoted', 'is_staff_pick', 'is_suspended'].map((k) => <button key={k} className={`${chipBtn} ${p[k] ? 'bg-ashe-yellow' : ''}`} onClick={() => patch(p.id, { [k]: p[k] ? 0 : 1 })}>{k.replace('is_', '').replace('_', ' ')}</button>)}</div>,
        has('admin') && <button key='d' className={chipBtn} onClick={() => confirm('Delete this campaign?') && run(() => api(`/projects/${p.id}`, { method: 'DELETE' }))}>Delete</button>])} />
    </Panel>
  );
}

export function DonationsTab() {
  const d = useData('/donations?limit=300'); const [err, run] = useAct([d.reload]);
  return (
    <Panel title='Donations' note={err || d.err}>
      <Table cols={['Date', 'Donor', 'Amount', 'Provider', 'Status']} rows={(d.data || []).map((x) => [day(x.created_at), x.donor_name || x.donor_email || 'Guest', money(x.amount, x.currency), x.payment_provider || '',
        <select key='s' className='rounded-lg border-2 border-ashe-ink p-1' value={x.status} onChange={(e) => run(() => api(`/donations/${x.id}`, { method: 'PATCH', body: { status: e.target.value } }))}>{['pending', 'completed', 'failed', 'refunded'].map((s) => <option key={s}>{s}</option>)}</select>])} />
    </Panel>
  );
}

export function WithdrawalsTab() {
  const d = useData('/withdrawals'); const [err, run] = useAct([d.reload]);
  return (
    <Panel title='Withdrawal requests' note={err || d.err}>
      <Table cols={['Date', 'Amount', 'Method', 'Details', 'Status', '']} rows={(d.data || []).map((w) => [day(w.created_at), Number(w.amount).toLocaleString(), w.method, w.details, w.status,
        <div key='a' className='flex gap-1'>{['approved', 'rejected', 'paid'].map((s) => <button key={s} className={chipBtn} disabled={w.status === s} onClick={() => run(() => api(`/withdrawals/${w.id}`, { method: 'PATCH', body: { status: s } }))}>{s}</button>)}</div>])} />
    </Panel>
  );
}

export function LeadsTab() {
  const [type, setType] = useState('');
  const d = useData(`/leads${type ? `?type=${type}` : ''}`);
  return (
    <Panel title='Leads & pledges' note={d.err}>
      <div className='mb-3 flex flex-wrap gap-2'>{['', 'pledge', 'partner', 'volunteer', 'contact'].map((t) => <button key={t} onClick={() => setType(t)} className={`${chipBtn} ${type === t ? 'bg-ashe-ink text-ashe-cream' : ''}`}>{t || 'all'}</button>)}</div>
      <Table cols={['Date', 'Type', 'Name', 'Email', 'Org', 'Amount', 'Method', 'Message']} rows={(d.data || []).map((l) => [day(l.created_at), l.type, l.name, l.email, l.organization, l.amount ? money(l.amount, l.currency) : '', l.method, l.message])} />
    </Panel>
  );
}

export function ContentTab() {
  const d = useData('/content'); const [err, run] = useAct([d.reload]);
  const [key, setKey] = useState(''); const [text, setText] = useState('');
  const pick = (k, v) => { setKey(k); setText(JSON.stringify(v, null, 2)); };
  const save = () => run(async () => { await api('/content', { method: 'POST', body: { key, value: JSON.parse(text) } }); });
  return (
    <Panel title='Site content' note={err || d.err}>
      <div className='mb-3 flex flex-wrap gap-2'>{(d.data || []).map((c) => <button key={c.key} className={`${chipBtn} ${key === c.key ? 'bg-ashe-yellow' : ''}`} onClick={() => pick(c.key, c.value)}>{c.key}</button>)}
        <button className={chipBtn} onClick={() => { const k = prompt('New content key (letters, numbers, _ . -)'); if (k) pick(k, {}); }}>+ New key</button></div>
      {key && <><label className={lbl}>{key} (JSON)</label><textarea rows={12} className={`${inp} font-mono text-sm`} value={text} onChange={(e) => setText(e.target.value)} /><div className='mt-3'><Button onClick={save}>Save</Button></div></>}
    </Panel>
  );
}

export function MyCampaignsTab() {
  const { user } = useAuth();
  const d = useData(`/projects?owner_id=${user.id}`); const [err, run] = useAct([d.reload]);
  const [f, setF] = useState({ title: '', category: 'general', location: '', goal_amount: '', story: '', image_url: '' });
  const [w, setW] = useState({ project_id: '', amount: '', method: 'bank', details: '' });
  const s = (o, set) => (k) => (e) => set({ ...o, [k]: e.target.value });
  return (
    <div className='grid gap-4'>
      <Panel title='My campaigns' note={err || d.err}><Table cols={['Title', 'Status', 'Raised / goal']} rows={(d.data || []).map((p) => [p.title, p.status, `${Number(p.raised_amount).toLocaleString()} / ${Number(p.goal_amount).toLocaleString()}`])} empty='No campaigns yet.' /></Panel>
      <Panel title='Start a campaign'>
        <form onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/projects', { method: 'POST', body: f }); setF({ ...f, title: '', story: '' }); }); }}>
          <label className={lbl}>Title</label><input required className={inp} value={f.title} onChange={s(f, setF)('title')} />
          <div className='grid gap-3 md:grid-cols-3'><div><label className={lbl}>Category</label><input className={inp} value={f.category} onChange={s(f, setF)('category')} /></div><div><label className={lbl}>Location</label><input className={inp} value={f.location} onChange={s(f, setF)('location')} /></div><div><label className={lbl}>Goal</label><input type='number' min='0' className={inp} value={f.goal_amount} onChange={s(f, setF)('goal_amount')} /></div></div>
          <label className={lbl}>Story</label><textarea rows={4} className={inp} value={f.story} onChange={s(f, setF)('story')} />
          <p className='mt-2 text-sm opacity-70'>Campaigns are reviewed by the ASHE team before going live.</p><div className='mt-3'><Button type='submit'>Submit for review</Button></div>
        </form>
      </Panel>
      <Panel title='Request a payout'>
        <form className='grid gap-3 md:grid-cols-4' onSubmit={(e) => { e.preventDefault(); run(() => api('/withdrawals', { method: 'POST', body: w })); }}>
          <div><label className={lbl}>Campaign</label><select required className={inp} value={w.project_id} onChange={s(w, setW)('project_id')}><option value=''>Select</option>{(d.data || []).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
          <div><label className={lbl}>Amount</label><input required type='number' min='1' className={inp} value={w.amount} onChange={s(w, setW)('amount')} /></div>
          <div><label className={lbl}>Method</label><select className={inp} value={w.method} onChange={s(w, setW)('method')}><option value='bank'>Bank</option><option value='mobile_money'>Mobile money</option></select></div>
          <div><label className={lbl}>Details</label><input className={inp} value={w.details} onChange={s(w, setW)('details')} /></div>
          <div className='md:col-span-4'><Button type='submit'>Request payout</Button></div>
        </form>
      </Panel>
    </div>
  );
}

export function MyDonationsTab() {
  const d = useData('/me/donations');
  return <Panel title='My donations' note={d.err}><Table cols={['Date', 'Campaign', 'Amount', 'Status']} rows={(d.data || []).map((x) => [day(x.created_at), x.project_title || 'General fund', money(x.amount, x.currency), x.status])} empty='No donations yet.' /></Panel>;
}

export function OrgsTab() {
  const { user } = useAuth();
  const d = useData(`/organizations?owner_id=${user.id}`); const [err, run] = useAct([d.reload]);
  const [f, setF] = useState({ name: '', org_type: 'ngo', website: '', country: '' });
  return (
    <div className='grid gap-4'>
      <Panel title='My organizations' note={err || d.err}><Table cols={['Name', 'Type', 'Country', 'Website']} rows={(d.data || []).map((o) => [o.name, o.org_type, o.country, o.website])} empty='No organizations yet.' /></Panel>
      <Panel title='Add an organization'>
        <form className='grid gap-3 md:grid-cols-4' onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/organizations', { method: 'POST', body: { ...f, is_donor: true, accepted_terms: true } }); setF({ ...f, name: '' }); }); }}>
          {[['name', 'Name'], ['org_type', 'Type'], ['country', 'Country'], ['website', 'Website']].map(([k, l]) => <div key={k}><label className={lbl}>{l}</label><input required={k === 'name'} className={inp} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>)}
          <div className='md:col-span-4'><Button type='submit'>Add</Button></div>
        </form>
      </Panel>
    </div>
  );
}

export const TABS = [
  { id: 'users', label: 'Users & roles', roles: ['admin'], C: UsersTab },
  { id: 'campaigns', label: 'Campaigns', roles: ['admin', 'designer'], C: ProjectsTab },
  { id: 'donations', label: 'Donations', roles: ['admin', 'finance'], C: DonationsTab },
  { id: 'withdrawals', label: 'Withdrawals', roles: ['admin', 'finance'], C: WithdrawalsTab },
  { id: 'leads', label: 'Leads & pledges', roles: ['admin'], C: LeadsTab },
  { id: 'content', label: 'Site content', roles: ['admin', 'designer'], C: ContentTab },
  { id: 'mine', label: 'My campaigns', roles: ['fundraiser', 'admin'], C: MyCampaignsTab },
  { id: 'gifts', label: 'My donations', roles: ['donor', 'fundraiser', 'partner', 'admin'], C: MyDonationsTab },
  { id: 'orgs', label: 'Organizations', roles: ['partner', 'donor', 'admin'], C: OrgsTab },
];
