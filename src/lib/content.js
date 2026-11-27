import { REGISTRY } from '../data/registry.js';

const PREFIX = 'site.';

// Applies saved content (key "site.<name>") onto the live data objects. Wrong-shaped or empty values are ignored, so a bad edit can never break the page.
export function applyContent(list) {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    if (!item || typeof item.key !== 'string' || !item.key.startsWith(PREFIX)) continue;
    const e = REGISTRY[item.key.slice(PREFIX.length)];
    if (!e) continue;
    try {
      const cur = e.get();
      const v = item.value;
      if (v === null || v === undefined || Array.isArray(cur) !== Array.isArray(v) || typeof cur !== typeof v) continue;
      if (Array.isArray(v) && v.length < (e.root?.min || 0)) continue;
      e.set(v);
    } catch { /* keep the built-in content */ }
  }
}

// Fetches all saved content (waits at most ~2 seconds) and applies it. Never throws: on any problem the built-in content is used.
export async function loadContent(ms = 2000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch('/api/content', { signal: ctrl.signal, cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    applyContent(Array.isArray(j) ? j : j?.data);
  } catch { /* offline or slow: built-in content */ } finally { clearTimeout(timer); }
}
