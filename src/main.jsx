import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// The prerendered HTML in each page is for search engines, link previews and fast first paint.
// The browser then renders the app fresh (no hydration), so every animation starts from a clean state on every page load.
const el = document.getElementById('root');
el.replaceChildren();
createRoot(el).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Every internal link is a real page load: the browser fetches that page's own HTML, and its entrance animations play from the start.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('/') || href.startsWith('//')) return;
  e.preventDefault();
  e.stopPropagation();
  window.location.assign(href);
}, true);
