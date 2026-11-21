import { MotionConfig } from 'framer-motion';
import { Link, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import { Login, Reset, Signup } from './pages/Auth.jsx';
import { About, Contact, GalleryPage, PartnersPage, ProgramsPage, StartFundraiser, Volunteer } from './pages/Pages.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';

const NotFound = () => (
  <main className='grid min-h-screen place-items-center p-6 text-center'>
    <div><h1 className='text-7xl'>Page not found</h1><Link to='/' className='mt-4 inline-block font-bold underline'>Back to home</Link></div>
  </main>
);

export default function App() {
  return (
    <MotionConfig reducedMotion='user'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/programs' element={<ProgramsPage />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/partners' element={<PartnersPage />} />
          <Route path='/volunteer' element={<Volunteer />} />
          <Route path='/gallery' element={<GalleryPage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/start-fundraiser' element={<StartFundraiser />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/auth' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/reset-password' element={<Reset />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </MotionConfig>
  );
}
