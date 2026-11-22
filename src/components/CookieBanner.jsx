import { useEffect, useState } from 'react';

const KEY = 'ashe_cookie_choice';

// Starts hidden so the server HTML and the first browser render match; shows after load if no choice was saved yet.
export default function CookieBanner() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setShown(true); } catch { /* storage blocked: stay hidden */ }
  }, []);
  const choose = (v) => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } setShown(false); };
  if (!shown) return null;
  return (
    <div role='dialog' aria-label='Cookie notice' className='fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-xl rounded-2xl border-2 border-ashe-ink bg-white p-4 shadow-xl'>
      <p className='text-sm'>We use a sign-in cookie and a few privacy-friendly settings to run this site. We do not sell your data. See our <a className='font-bold underline' href='/privacy'>Privacy Policy</a>.</p>
      <div className='mt-3 flex gap-2'>
        <button onClick={() => choose('all')} className='rounded-full bg-ashe-green px-4 py-2 text-xs font-bold uppercase text-white'>Accept all</button>
        <button onClick={() => choose('necessary')} className='rounded-full border-2 border-ashe-ink px-4 py-2 text-xs font-bold uppercase'>Necessary only</button>
      </div>
    </div>
  );
}
