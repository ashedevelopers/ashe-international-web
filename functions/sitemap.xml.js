const STATIC = { '/': 1.0, '/about': 0.8, '/programs': 0.8, '/projects': 0.9, '/reports': 0.7, '/partners': 0.6, '/volunteer': 0.6, '/gallery': 0.5, '/contact': 0.6, '/start-fundraiser': 0.7, '/privacy': 0.2, '/terms': 0.2 };
const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

// GET /sitemap.xml: static pages + live campaigns + donor organizations.
export async function onRequestGet({ env }) {
  const base = (env.APP_URL || '').replace(/\/$/, '');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const [path, prio] of Object.entries(STATIC)) xml += `  <url><loc>${esc(base + path)}</loc><priority>${prio}</priority></url>\n`;
  const projects = await env.DB.prepare("SELECT slug, updated_at FROM projects WHERE status IN ('active','funded') AND is_suspended = 0 AND slug IS NOT NULL ORDER BY updated_at DESC LIMIT 1000").all();
  for (const p of projects.results) xml += `  <url><loc>${esc(`${base}/c/${p.slug}`)}</loc><lastmod>${String(p.updated_at).slice(0, 10)}</lastmod><priority>0.7</priority></url>\n`;
  const orgs = await env.DB.prepare('SELECT slug FROM organizations WHERE is_donor = 1 ORDER BY created_at DESC LIMIT 500').all();
  for (const o of orgs.results) xml += `  <url><loc>${esc(`${base}/org/${o.slug}`)}</loc><priority>0.4</priority></url>\n`;
  return new Response(`${xml}</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
