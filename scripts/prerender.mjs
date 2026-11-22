import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// Build-time server-side rendering: after the normal client build, render every public route to its own HTML file
// (dist/about/index.html and so on) so each page is real, crawlable HTML that loads on its own.
// If anything here fails, the plain single-page build in dist/ is still valid, so the deploy never breaks.
const root = process.cwd();
const dist = path.join(root, 'dist');
const out = path.join(root, 'dist-ssr');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function main() {
  await build({ logLevel: 'warn', build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', emptyOutDir: true } });
  const file = fs.readdirSync(out).find((f) => /^entry-server\.m?js$/.test(f));
  const { render } = await import(pathToFileURL(path.join(out, file)).href);
  const { ROUTES, SITE_URL } = await import(pathToFileURL(path.join(root, 'src/data/routes.js')).href);
  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

  let done = 0;
  for (const r of ROUTES) {
    try {
      const markup = render(r.path);
      const html = template
        .replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
        .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(r.title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + esc(r.description) + b)
        .replace('</head>', () => `<link rel="canonical" href="${SITE_URL}${r.path}" />\n<script>window.__SSR_PATH__=${JSON.stringify(r.path)}</script>\n</head>`);
      const target = r.path === '/' ? path.join(dist, 'index.html') : path.join(dist, r.path.slice(1), 'index.html');
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
      done += 1;
    } catch (e) {
      console.warn(`[prerender] skipped ${r.path}: ${e.message}`);
    }
  }
  console.log(`[prerender] wrote ${done}/${ROUTES.length} pages`);
}

main()
  .catch((e) => console.warn(`[prerender] failed, shipping the single-page build only: ${e.message}`))
  .finally(() => fs.rmSync(out, { recursive: true, force: true }));
