import { motion } from 'framer-motion';
import { Sticker } from './ui.jsx';
import { Sparkle } from './Deco.jsx';
import { Float, TextReveal } from './Motion.jsx';

// Page title band used on every inner page: the card scales in, the sticker drops with a bounce, the title words rise one by one, sparkles float.
export default function PageHeader({ title, intro, tag, tone = 'bg-ashe-mint' }) {
  return (
    <motion.section className={`relative mx-3.5 mt-3 overflow-hidden rounded-[32px] px-5 pb-12 pt-16 text-center md:mx-7 md:pb-16 md:pt-24 ${tone}`}
      initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
      <Float className='absolute right-6 top-6 hidden md:block' amp={10} dur={6}><Sparkle className='h-14 w-14 animate-spin-slow' /></Float>
      <Float className='absolute bottom-6 left-8 hidden md:block' amp={8} dur={5} delay={1}><Sparkle className='h-9 w-9' /></Float>
      {tag && (
        <motion.div className='absolute left-4 top-5 md:left-8 md:top-7' initial={{ y: -40, opacity: 0, rotate: -25 }} animate={{ y: 0, opacity: 1, rotate: -5 }} transition={{ type: 'spring', delay: 0.5, stiffness: 160, damping: 11 }}>
          <Sticker rotate={0}>{tag}</Sticker>
        </motion.div>
      )}
      <h1 className='mx-auto max-w-5xl text-[clamp(46px,10vw,120px)]'><TextReveal text={title} delay={0.2} /></h1>
      {intro && <motion.p className='mx-auto mt-4 max-w-2xl text-base md:text-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>{intro}</motion.p>}
    </motion.section>
  );
}
