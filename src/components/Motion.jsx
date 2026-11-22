import { motion } from 'framer-motion';
import { useForceIn } from '../lib/motion.js';

// Reusable motion building blocks used across the whole site.
const FROM = { up: { y: 40 }, down: { y: -40 }, left: { x: -60 }, right: { x: 60 }, zoom: { scale: 0.85 }, none: {} };

// <Stagger> reveals its <Item> children one after another when scrolled into view.
export function Stagger({ children, className = '', delay = 0, gap = 0.09, as = 'div' }) {
  const forced = useForceIn();
  const Tag = motion[as];
  return (
    <Tag className={className} initial='hidden' whileInView='show' animate={forced ? 'show' : undefined} viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}>
      {children}
    </Tag>
  );
}

export function Item({ children, className = '', from = 'up', as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={{ hidden: { opacity: 0, ...FROM[from] }, show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } } }}>
      {children}
    </Tag>
  );
}

// Words rise into place one by one (plays on load).
export function TextReveal({ text, className = '', delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden='true' className='mr-[.25em] inline-block overflow-hidden pb-[.08em] align-bottom'>
          <motion.span className='inline-block' initial={{ y: '110%', rotate: 6 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.8, delay: delay + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

// Gentle endless floating.
export const Float = ({ children, className = '', amp = 8, dur = 5, delay = 0 }) => (
  <motion.div className={className} animate={{ y: [0, -amp, 0] }} transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}>{children}</motion.div>
);

// Soft attention pulse for important buttons.
export const Pulse = ({ children, className = '' }) => (
  <motion.div className={className} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>{children}</motion.div>
);
