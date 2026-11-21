export const Sparkle = ({ className = '' }) => (
  <svg viewBox='0 0 100 100' aria-hidden='true' className={className}>
    <path d='M50 0C54 30 70 46 100 50 70 54 54 70 50 100 46 70 30 54 0 50 30 46 46 30 50 0Z' fill='#0F0F0F' />
  </svg>
);

// Circular spinning text badge with a down-arrow button in the middle.
export function RotatingBadge({ text = 'EMPOWER · GROW · THRIVE · ASHE ·', href = '#story', className = '' }) {
  return (
    <a href={href} aria-label='Scroll down' className={`relative block ${className}`}>
      <svg viewBox='0 0 100 100' className='h-full w-full animate-spin-slow'>
        <defs><path id='badgeCircle' d='M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0' /></defs>
        <circle cx='50' cy='50' r='48' fill='#fff' stroke='#0F0F0F' strokeWidth='2' />
        <text fontSize='10.5' fontWeight='700' fill='#0F0F0F' letterSpacing='2'><textPath href='#badgeCircle'>{text}</textPath></text>
      </svg>
      <span className='absolute inset-0 grid place-items-center'><span className='grid h-9 w-9 place-items-center rounded-full bg-ashe-ink text-white'>↓</span></span>
    </a>
  );
}
