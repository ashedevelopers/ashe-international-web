import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQS } from '../data/asheContent.js';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id='faq' className='mx-3.5 my-16 md:mx-7'>
      <h2 className='mb-7 text-center text-[clamp(40px,8vw,92px)]'>Got questions?</h2>
      <div className='mx-auto grid max-w-3xl gap-2.5'>
        {FAQS.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className={`overflow-hidden rounded-[18px] border-2 border-ashe-ink transition-colors duration-300 ${on ? 'bg-ashe-mint' : ''}`}>
              <button className='flex w-full items-center justify-between gap-3 px-[18px] py-4 text-left font-bold' aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
                {f.q}
                <motion.i animate={{ rotate: on ? 180 : 0 }} className='grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-ashe-yellow text-[22px] not-italic'>{on ? '−' : '+'}</motion.i>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className='overflow-hidden'>
                    <p className='px-[18px] pb-[18px]'>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
