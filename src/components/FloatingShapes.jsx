import { motion } from 'framer-motion';

const SHAPES = [
  { l: '5%', s: 14, d: 22, delay: 0, c: '#F9C61F', sway: 22, kind: 'dot' },
  { l: '14%', s: 20, d: 28, delay: 6, c: '#0E622A', sway: -30, kind: 'diamond' },
  { l: '24%', s: 12, d: 19, delay: 3, c: '#E9B58A', sway: 18, kind: 'dot' },
  { l: '36%', s: 18, d: 25, delay: 11, c: '#F9C61F', sway: -24, kind: 'diamond' },
  { l: '48%', s: 10, d: 21, delay: 8, c: '#0E622A', sway: 26, kind: 'dot' },
  { l: '58%', s: 22, d: 30, delay: 2, c: '#CFE9D3', sway: -20, kind: 'diamond' },
  { l: '69%', s: 14, d: 23, delay: 13, c: '#F9C61F', sway: 28, kind: 'dot' },
  { l: '79%', s: 18, d: 27, delay: 5, c: '#E9B58A', sway: -26, kind: 'diamond' },
  { l: '88%', s: 12, d: 20, delay: 9, c: '#0E622A', sway: 20, kind: 'dot' },
  { l: '95%', s: 16, d: 26, delay: 1, c: '#F9C61F', sway: -18, kind: 'diamond' },
];

// Ambient layer: small coloured shapes drift up the screen forever on every page (decorative, never blocks touches).
export default function FloatingShapes() {
  return (
    <div aria-hidden='true' className='pointer-events-none fixed inset-0 z-20 overflow-hidden'>
      {SHAPES.map((p, i) => (
        <motion.span key={i} className={`absolute ${p.kind === 'dot' ? 'rounded-full' : 'rounded-[3px]'}`}
          style={{ left: p.l, bottom: -40, width: p.s, height: p.s, background: p.c, opacity: 0.6 }}
          animate={{ y: ['0vh', '-115vh'], x: [0, p.sway, -p.sway, 0], rotate: p.kind === 'diamond' ? [45, 405] : 0 }}
          transition={{ y: { duration: p.d, repeat: Infinity, ease: 'linear', delay: p.delay * -1 }, x: { duration: p.d / 2.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: p.d / 1.5, repeat: Infinity, ease: 'linear' } }} />
      ))}
    </div>
  );
}
