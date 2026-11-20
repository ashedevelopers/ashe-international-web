import { motion } from 'framer-motion';
import { IMG_LIVE } from '../data/asheContent.js';

// Local file first (/images/<name>.jpg), then the live site's copy.
export function Img({ name, alt = '', className = '', ...rest }) {
  return (
    <img
      src={`/images/${name}.jpg`} alt={alt} loading='lazy' decoding='async' className={className}
      onError={(e) => {
        const f = IMG_LIVE[name];
        if (f && !e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = `https://asheinternational.org/assets/${f}`; }
      }}
      {...rest}
    />
  );
}

// Inline a raw .svg (imported with ?raw) so its CSS animations run.
export const Svg = ({ src, className = '' }) => (
  <span aria-hidden='true' className={`block [&>svg]:h-full [&>svg]:w-full ${className}`} dangerouslySetInnerHTML={{ __html: src }} />
);

export const Reveal = ({ children, i = 0, tilt = 0, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 36, rotate: tilt }} whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}>
    {children}
  </motion.div>
);

export const Sticker = ({ children, tone = 'yellow', rotate = -4, className = '' }) => (
  <span style={{ transform: `rotate(${rotate}deg)`, clipPath: 'polygon(0 0,100% 0,97% 50%,100% 100%,0 100%,3% 50%)' }}
    className={`inline-block border border-ashe-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ashe-ink ${tone === 'mint' ? 'bg-ashe-mint' : 'bg-ashe-yellow'} ${className}`}>
    {children}
  </span>
);

const TONES = {
  green: ['bg-ashe-green text-white', 'bg-ashe-yellow text-ashe-ink'],
  yellow: ['bg-ashe-yellow text-ashe-ink', 'bg-ashe-ink text-ashe-yellow'],
  white: ['bg-white text-ashe-ink', 'bg-ashe-yellow text-ashe-ink'],
};

export function Button({ as: Tag = 'button', tone = 'green', icon = '→', className = '', children, ...rest }) {
  const [body, chip] = TONES[tone];
  return (
    <Tag className={`group inline-flex h-[46px] items-center gap-2.5 rounded-full pl-[18px] text-[13px] font-bold uppercase tracking-wider transition active:scale-[.97] ${body} ${className}`} {...rest}>
      {children}
      <i className={`m-1 grid h-[38px] w-[38px] place-items-center rounded-full not-italic transition duration-300 group-hover:-rotate-45 ${chip}`}>{icon}</i>
    </Tag>
  );
}
