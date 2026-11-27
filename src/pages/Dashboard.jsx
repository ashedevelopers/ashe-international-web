import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../lib/auth.jsx';
import { Button } from '../components/ui.jsx';
import Logo from '../components/Logo.jsx';
import { TABS } from './tabs.jsx';
import ReportsTab from './ReportsTab.jsx';
import ContentEditor from './ContentEditor.jsx';

// "Site content" uses the form editor; the old raw-JSON editor stays available inside it under "advanced".
const ALL = [...TABS.map((t) => (t.id === 'content' ? { ...t, C: ContentEditor } : t)), { id: 'reports', label: 'Reports', roles: ['admin', 'designer'], C: ReportsTab }];

export default function Dashboard() {
  const { user, has, signout } = useAuth();
  const tabs = user ? ALL.filter((t) => has(...t.roles)) : [];
  const [id, setId] = useState(null);
  if (user === undefined) return <p className='p-8'>Loading...</p>;
  if (!user) return <Navigate to='/login' replace />;
  const cur = tabs.find((t) => t.id === id) || tabs[0];
  return (
    <div className='min-h-screen'>
      <motion.header className='flex items-center justify-between border-b border-black/10 px-4 py-2 md:px-9' initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Link to='/' aria-label='ASHE home'><Logo className='h-10' /></Link>
        <div className='flex items-center gap-3 text-sm'>
          <span className='hidden md:inline'>{user.display_name || user.email} ({user.roles.join(', ')})</span>
          <Button tone='yellow' icon='↳' onClick={signout}>Sign out</Button>
        </div>
      </motion.header>
      <div className='mx-auto max-w-6xl p-4 md:p-8'>
        <motion.h1 className='mb-5 text-5xl md:text-7xl' initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>Dashboard</motion.h1>
        <nav className='mb-5 flex flex-wrap gap-2' aria-label='Dashboard sections'>
          {tabs.map((t, n) => (
            <motion.button key={t.id} onClick={() => setId(t.id)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + n * 0.05 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              className={`rounded-full border-2 border-ashe-ink px-4 py-2 text-[13px] font-bold transition-colors ${cur?.id === t.id ? 'bg-ashe-ink text-white' : 'bg-white'}`}>{t.label}</motion.button>
          ))}
        </nav>
        <AnimatePresence mode='wait'>
          {cur ? <motion.div key={cur.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><cur.C /></motion.div> : <p>No dashboard is available for your account yet.</p>}
        </AnimatePresence>
      </div>
    </div>
  );
}
