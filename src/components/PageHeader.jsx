import { Sticker } from './ui.jsx';

// Page title band used on every inner page: tinted rounded card, tilted sticker, big display title.
export default function PageHeader({ title, intro, tag, tone = 'bg-ashe-mint' }) {
  return (
    <section className={`relative mx-3.5 mt-3 overflow-hidden rounded-[32px] px-5 pb-12 pt-16 text-center md:mx-7 md:pb-16 md:pt-24 ${tone}`}>
      {tag && <Sticker rotate={-5} className='absolute left-4 top-5 md:left-8 md:top-7'>{tag}</Sticker>}
      <h1 className='mx-auto max-w-5xl text-[clamp(46px,10vw,120px)]'>{title}</h1>
      {intro && <p className='mx-auto mt-4 max-w-2xl text-base md:text-lg'>{intro}</p>}
    </section>
  );
}
