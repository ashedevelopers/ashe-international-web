import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Pages that were rendered to HTML at build time are hydrated in place; any other address (for example /c/<slug>) renders normally.
const el = document.getElementById('root');
const here = window.location.pathname.replace(/\/+$/, '') || '/';
if (window.__SSR_PATH__ === here && el.hasChildNodes()) hydrateRoot(el, tree);
else createRoot(el).render(tree);

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
