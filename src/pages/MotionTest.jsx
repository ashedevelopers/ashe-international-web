import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const box = 'grid h-20 w-20 place-items-center rounded-2xl bg-ashe-yellow font-bold';

// /motion-test: a one-page check of what this device and browser actually allow. Screenshot it or record it.
export default function MotionTest() {
  const [fps, setFps] = useState(0);
  const [seen, setSeen] = useState(false);
  const [info, setInfo] = useState({});
  const frames = useRef(0);

  useEffect(() => {
    setInfo({
      'Reduce Motion setting': window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'ON (the site ignores it)' : 'off',
      'Scroll observer (IntersectionObserver)': 'IntersectionObserver' in window ? 'yes' : 'NO',
      'Web Animations (element.animate)': 'animate' in Element.prototype ? 'yes' : 'NO',
      'Save-Data mode': navigator.connection?.saveData ? 'ON' : 'off',
      'Screen': `${window.innerWidth} x ${window.innerHeight}`,
      Browser: navigator.userAgent.replace(/\).*/, ')'),
    });
    let raf; let last = performance.now();
    const tick = (t) => {
      frames.current += 1;
      if (t - last >= 1000) { setFps(Math.round((frames.current * 1000) / (t - last))); frames.current = 0; last = t; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main className='mx-auto max-w-xl p-5'>
      <h1 className='text-5xl'>Motion test</h1>
      <p className='mt-2'>Each box below should be moving. Take a screenshot of this page, or a short screen recording while you scroll to the bottom.</p>

      <div className='mt-6 grid gap-4'>
        <div className='flex items-center gap-4 rounded-2xl border-2 border-ashe-ink p-4'>
          <div className={`${box} animate-spin`}>CSS</div>
          <p><b>1. CSS animation.</b> The yellow box should spin round and round.</p>
        </div>
        <div className='flex items-center gap-4 rounded-2xl border-2 border-ashe-ink p-4'>
          <motion.div className={box} animate={{ x: [0, 90, 0], rotate: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>JS</motion.div>
          <p><b>2. Framer Motion.</b> This box should slide right and back.</p>
        </div>
        <div className='rounded-2xl border-2 border-ashe-ink p-4'>
          <p><b>3. Frame counter.</b> Frames per second right now:</p>
          <p className='font-display text-6xl'>{fps}</p>
          <p className='text-sm'>0 means the browser is not running animation frames at all. 30 to 60 is normal.</p>
        </div>
        <div className='rounded-2xl border-2 border-ashe-ink p-4'>
          <p className='mb-2'><b>4. This device</b></p>
          <dl className='grid gap-1 text-sm'>{Object.entries(info).map(([k, v]) => <div key={k}><dt className='inline font-bold'>{k}: </dt><dd className='inline'>{v}</dd></div>)}</dl>
        </div>
      </div>

      <p className='mt-6'><b>5. Scroll reveal.</b> Scroll down to the green box.</p>
      <div style={{ height: 900 }} />
      <motion.div className='rounded-2xl bg-ashe-green p-6 text-white' initial={{ opacity: 0, y: 60, rotate: -6 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9 }} onViewportEnter={() => setSeen(true)}>
        <p className='font-display text-4xl'>{seen ? 'Scroll reveal works' : 'Waiting...'}</p>
      </motion.div>
      <div style={{ height: 300 }} />
    </main>
  );
}
