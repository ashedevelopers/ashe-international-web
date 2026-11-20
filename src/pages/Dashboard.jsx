import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { Button } from '../components/ui.jsx';
import { TABS } from './tabs.jsx';

export default function Dashboard() {
  const { user, has, signout } = useAuth();
  const tabs = user ? TABS.filter((t) => has(...t.roles)) : [];
  const [id, setId] = useState(null);
  if (user === undefined) return <p className='p-8'>Loading...</p>;
  if (!user) return <Navigate to='/login' replace />;
  const cur = tabs.find((t) => t.id === id) || tabs[0];
  return (
    <div className='min-h-screen'>
      <header className='flex items-center justify-between border-b border-black/10 px-4 py-3 md:px-9'>
        <Link to='/' className='font-display text-2xl uppercase'>ASHE</Link>
        <div className='flex items-center gap-3 text-sm'>
          <span className='hidden md:inline'>{user.display_name || user.email} ({user.roles.join(', ')})</span>
          <Button tone='yellow' icon='↳' onClick={signout}>Sign out</Button>
        </div>
      </header>
      <div className='mx-auto max-w-6xl p-4 md:p-8'>
        <h1 className='mb-5 text-5xl md:text-7xl'>Dashboard</h1>
        <nav className='mb-5 flex flex-wrap gap-2' aria-label='Dashboard sections'>
          {tabs.map((t) => <button key={t.id} onClick={() => setId(t.id)} className={`rounded-full border-2 border-ashe-ink px-4 py-2 text-[13px] font-bold ${cur?.id === t.id ? 'bg-ashe-ink text-ashe-cream' : ''}`}>{t.label}</button>)}
        </nav>
        {cur ? <cur.C key={cur.id} /> : <p>No dashboard is available for your account yet.</p>}
      </div>
    </div>
  );
}
