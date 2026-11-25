import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Link, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import Reports from './pages/Reports.jsx';
import Campaign from './pages/Campaign.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import PartnersPage from './pages/PartnersPage.jsx';
import MotionTest from './pages/MotionTest.jsx';
import { Login, Reset, Signup } from './pages/Auth.jsx';
import { Contact, GalleryPage, StartFundraiser, Volunteer } from './pages/Pages.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';

const NotFound = () => (
  <main className='grid min-h-screen place-items-center p-6 text-center'>
    <div><h1 className='text-7xl'>Page not found</h1><Link to='/' className='mt-4 inline-block font-bold underline'>Back to home</Link></div>
  </main>
);

const KEY = 'ashe_motion';

// Motion is on by default on every device. The small button bottom-left lets a visitor pause it (for comfort, or to save battery).
export default function App() {
  const [paused, setPaused] = useState(false);
  useEffect(() => { try { if (localStorage.getItem(KEY) === 'paused') setPaused(true); } catch { /* ignore */ } }, []);
  useEffect(() => { document.documentElement.classList.toggle('motion-paused', paused); }, [paused]);
  const toggle = () => setPaused((p) => { const n = !p; try { localStorage.setItem(KEY, n ? 'paused' : 'on'); } catch { /* ignore */ } return n; });
  return (
    <MotionConfig reducedMotion={paused ? 'always' : 'never'}>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/programs' element={<ProgramsPage />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/c/:slug' element={<Campaign />} />
          <Route path='/partners' element={<PartnersPage />} />
          <Route path='/volunteer' element={<Volunteer />} />
          <Route path='/gallery' element={<GalleryPage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/start-fundraiser' element={<StartFundraiser />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/motion-test' element={<MotionTest />} />
          <Route path='/auth' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/reset-password' element={<Reset />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <button type='button' onClick={toggle} aria-pressed={paused} className='fixed bottom-3 left-3 z-[55] rounded-full border border-ashe-ink/30 bg-white/90 px-3 py-1.5 text-[11px] font-bold shadow backdrop-blur'>
        {paused ? '▶ Play motion' : '⏸ Pause motion'}
      </button>
    </MotionConfig>
  );
}
