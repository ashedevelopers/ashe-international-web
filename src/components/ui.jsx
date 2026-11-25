import { motion } from 'framer-motion';
import { IMG_LIVE } from '../data/asheContent.js';
import { useForceIn } from '../lib/motion.js';

// Local file first (/images/<name>.jpg), then the live site's copy, then a stand-in photo so a missing file never shows a broken icon.
export function Img({ name, alt = '', className = '', ...rest }) {
  return (
    <img
      src={`/images/${name}.jpg`} alt={alt} loading='lazy' decoding='async' className={className}
      onError={(e) => {
        const el = e.currentTarget;
        const f = IMG_LIVE[name];
        if (!el.dataset.fb) { el.dataset.fb = '1'; if (f) { el.src = `https://asheinternational.org/assets/${f}`; return; } }
        if (!el.dataset.fb2) { el.dataset.fb2 = '1'; el.src = '/images/community.jpg'; }
      }}
      {...rest}
    />
  );
}

// Inline a raw .svg (imported with ?raw) so its CSS animations run.
export const Svg = ({ src, className = '' }) => (
  <span aria-hidden='true' className={`block [&>svg]:h-full [&>svg]:w-full ${className}`} dangerouslySetInnerHTML={{ __html: src }} />
);

// Scroll-in reveal, then a gentle endless float so cards never sit still.
export const Reveal = ({ children, i = 0, tilt = 0, className = '' }) => {
  const forced = useForceIn();
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 36, rotate: tilt }} whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      animate={forced ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}>
      <motion.div className='h-full' animate={{ y: [0, -5, 0] }} transition={{ duration: 3.6 + (i % 3) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * 0.3 }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// Stickers wobble side to side all the time.
export const Sticker = ({ children, tone = 'yellow', rotate = -4, className = '' }) => (
  <motion.span style={{ clipPath: 'polygon(0 0,100% 0,97% 50%,100% 100%,0 100%,3% 50%)' }}
    animate={{ rotate: [rotate - 2.5, rotate + 2.5, rotate - 2.5] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    className={`inline-block border border-ashe-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ashe-ink ${tone === 'mint' ? 'bg-ashe-mint' : 'bg-ashe-yellow'} ${className}`}>
    {children}
  </motion.span>
);

const TONES = {
  green: ['bg-ashe-green text-white', 'bg-ashe-yellow text-ashe-ink'],
  yellow: ['bg-ashe-yellow text-ashe-ink', 'bg-ashe-ink text-ashe-yellow'],
  white: ['bg-white text-ashe-ink', 'bg-ashe-yellow text-ashe-ink'],
};

// The arrow chip nudges forward on a loop so buttons always look alive.
export function Button({ as: Tag = 'button', tone = 'green', icon = '→', className = '', children, ...rest }) {
  const [body, chip] = TONES[tone];
  return (
    <Tag className={`group inline-flex h-[46px] items-center gap-2.5 rounded-full pl-[18px] text-[13px] font-bold uppercase tracking-wider transition active:scale-[.97] ${body} ${className}`} {...rest}>
      {children}
      <motion.i className={`m-1 grid h-[38px] w-[38px] place-items-center rounded-full not-italic ${chip}`} animate={{ x: [0, 4, 0] }} whileHover={{ rotate: -45 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>{icon}</motion.i>
    </Tag>
  );
}
