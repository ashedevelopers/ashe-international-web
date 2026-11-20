import { MotionConfig } from 'framer-motion';
import { Link, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Login, Reset, Signup } from './pages/Auth.jsx';

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
