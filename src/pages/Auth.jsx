import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { Button } from '../components/ui.jsx';
import Logo from '../components/Logo.jsx';
import { inp, lbl } from './kit.jsx';

function Shell({ title, children, foot }) {
  return (
    <main className='grid min-h-screen place-items-center bg-ashe-mint/50 p-4'>
      <div className='w-full max-w-md rounded-[28px] border-2 border-ashe-ink bg-white p-6 md:p-8'>
        <Link to='/' aria-label='ASHE home' className='mb-4 inline-block'><Logo className='h-14' /></Link>
        <h1 className='mb-2 text-5xl'>{title}</h1>
        {children}
        <p className='mt-5 text-sm'>{foot}</p>
        <p className='mt-3 text-sm'><Link to='/' className='font-bold text-ashe-green underline'>← Back to the website</Link></p>
      </div>
    </main>
  );
}

function useForm(initial, onOk) {
  const [f, setF] = useState(initial); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await onOk(f); } catch (x) { setErr(x.message); } finally { setBusy(false); } };
  return { f, set, err, busy, submit };
}

const Err = ({ m }) => (m ? <p role='alert' className='mt-3 text-sm font-semibold text-red-700'>{m}</p> : null);

export function Login() {
  const { signin } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const x = useForm({ email: '', password: '' }, async (f) => { await signin(f.email, f.password); nav(loc.state?.from || '/dashboard', { replace: true }); });
  return (
    <Shell title='Sign in' foot={<>New here? <Link className='font-bold underline' to='/signup'>Create an account</Link></>}>
      <form onSubmit={x.submit}>
        <label className={lbl}>Email</label><input required type='email' autoComplete='email' className={inp} value={x.f.email} onChange={x.set('email')} />
        <label className={lbl}>Password</label><input required type='password' autoComplete='current-password' className={inp} value={x.f.password} onChange={x.set('password')} />
        <Err m={x.err} />
        <div className='mt-4 flex items-center justify-between'><Button type='submit' disabled={x.busy}>{x.busy ? 'Signing in...' : 'Sign in'}</Button><Link to='/reset-password' className='text-sm font-bold underline'>Forgot password?</Link></div>
      </form>
    </Shell>
  );
}

export function Signup() {
  const { signup } = useAuth(); const nav = useNavigate();
  const x = useForm({ name: '', email: '', password: '', audience: 'donor', donor_kind: 'individual', org_name: '', org_type: 'ngo', org_country: '', website: '' }, async (f) => { if (f.website) return; await signup(f); nav('/dashboard', { replace: true }); });
  const org = x.f.audience === 'donor' && x.f.donor_kind === 'organization';
  return (
    <Shell title='Join ASHE' foot={<>Already have an account? <Link className='font-bold underline' to='/login'>Sign in</Link></>}>
      <form onSubmit={x.submit}>
        <label className={lbl}>I want to</label>
        <select className={inp} value={x.f.audience} onChange={x.set('audience')}><option value='donor'>Donate / support</option><option value='fundraiser'>Start a fundraiser</option></select>
        {x.f.audience === 'donor' && <><label className={lbl}>As</label><select className={inp} value={x.f.donor_kind} onChange={x.set('donor_kind')}><option value='individual'>An individual</option><option value='organization'>An organization</option></select></>}
        <label className={lbl}>Full name</label><input required className={inp} value={x.f.name} onChange={x.set('name')} />
        <label className={lbl}>Email</label><input required type='email' autoComplete='email' className={inp} value={x.f.email} onChange={x.set('email')} />
        <label className={lbl}>Password (8+ characters)</label><input required minLength={8} type='password' autoComplete='new-password' className={inp} value={x.f.password} onChange={x.set('password')} />
        {org && <><label className={lbl}>Organization name</label><input required className={inp} value={x.f.org_name} onChange={x.set('org_name')} /><label className={lbl}>Country</label><input className={inp} value={x.f.org_country} onChange={x.set('org_country')} /></>}
        <input tabIndex={-1} autoComplete='off' aria-hidden='true' className='absolute -left-[9999px]' value={x.f.website} onChange={x.set('website')} />
        <Err m={x.err} />
        <div className='mt-4'><Button type='submit' disabled={x.busy}>{x.busy ? 'Creating...' : 'Create account'}</Button></div>
      </form>
    </Shell>
  );
}

// /reset-password asks for the email; /reset-password#access_token=... sets the new password.
export function Reset() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get('access_token');
  const [done, setDone] = useState('');
  const nav = useNavigate();
  const x = useForm({ email: '', password: '' }, async (f) => {
    if (token) { await api('/auth/reset-confirm', { method: 'POST', body: { token, password: f.password } }); setDone('Password updated.'); setTimeout(() => nav('/login'), 1200); }
    else { await api('/auth/reset-request', { method: 'POST', body: { email: f.email } }); setDone('If that email exists, a reset link has been sent.'); }
  });
  return (
    <Shell title={token ? 'New password' : 'Reset password'} foot={<Link className='font-bold underline' to='/login'>Back to sign in</Link>}>
      {done ? <p className='mt-2 font-semibold text-ashe-green'>{done}</p> : (
        <form onSubmit={x.submit}>
          {token
            ? <><label className={lbl}>New password (8+ characters)</label><input required minLength={8} type='password' autoComplete='new-password' className={inp} value={x.f.password} onChange={x.set('password')} /></>
            : <><label className={lbl}>Email</label><input required type='email' className={inp} value={x.f.email} onChange={x.set('email')} /></>}
          <Err m={x.err} />
          <div className='mt-4'><Button type='submit' disabled={x.busy}>{token ? 'Update password' : 'Send reset link'}</Button></div>
        </form>
      )}
    </Shell>
  );
}
