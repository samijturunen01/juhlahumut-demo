/**
 * prerender.mjs – turns every route into static HTML after `vite build`.
 *
 *   npm run build   (= build:client → build:ssr → prerender)
 *
 * For each route in src/data/site.ts it renders the React tree to HTML and writes
 *   dist/<route>.html  and  dist/<route>/index.html
 * so GitHub Pages serves /juhlatilat and /juhlatilat/ directly (no SPA redirect
 * hacks, correct HTTP 200 for deep links, content visible without JavaScript).
 * dist/404.html is the branded "page not found" – GitHub Pages serves it for any
 * unknown path, and the client app hydrates it at that URL.
 *
 * Environment:
 *   SITE_URL        absolute origin + base, no trailing slash (Open Graph image URLs; canonical when indexing)
 *   ALLOW_INDEXING  "true" only on the company's own production domain. Default: noindex everywhere.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/+$/, '');
const ALLOW_INDEXING = process.env.ALLOW_INDEXING === 'true';

const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { render, pages, prerenderPaths, findPageByPath, company, baseUrl, menuPriceRange, rentalExample } = server;

const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = (p) => (SITE_URL ? `${SITE_URL}${p}` : `${baseUrl}${p.replace(/^\//, '')}`);
const pageUrl = (p) => (p === '/' ? abs('/') : abs(p));

// Preload the two variable fonts used above the fold (latin subsets), so headline text does not reflow.
const assetsDir = path.join(dist, 'assets');
const fontPreloads = readdirSync(assetsDir)
  .filter((f) => /^(fraunces-latin-opsz-normal|instrument-sans-latin-wght-normal)[-.].*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="${baseUrl}assets/${f}" as="font" type="font/woff2" crossorigin>`);

function structuredData() {
  const lowest = Math.min(...rentalExample.tiers.filter((t) => t.priceInclVat !== null).map((t) => t.priceInclVat));
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EventVenue'],
    name: company.name,
    description: 'Yksityinen juhlatila, saunatila ja catering noin 10–50 hengen tilaisuuksiin Joensuussa.',
    telephone: company.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressCountry: company.address.country,
    },
    image: abs('/images/og-kuva.jpg'),
    sameAs: company.social.map((s) => s.url),
    maximumAttendeeCapacity: company.capacity.max,
    priceRange: `${lowest} € – (tilavuokra), catering ${menuPriceRange.min}–${menuPriceRange.max} € / hlö`,
    amenityFeature: ['Sauna', 'Biljardi', 'Ilmakiekko', 'Äänentoisto', 'Pysäköinti'].map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
  };
  // The demo is not the company's official site: only claim a URL when running on the authorised domain.
  if (ALLOW_INDEXING && SITE_URL) data.url = `${SITE_URL}/`;
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function head(page, routePath, { notFound = false } = {}) {
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    ALLOW_INDEXING && !notFound ? '<meta name="robots" content="index,follow">' : '<meta name="robots" content="noindex,nofollow">',
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="fi_FI">`,
    `<meta property="og:site_name" content="${esc(company.name)}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:image" content="${esc(abs('/images/og-kuva.jpg'))}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Juhlahumujen sali: sohvaryhmä ja avotakka ilta-auringossa">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ...fontPreloads,
  ];
  if (!notFound) tags.push(`<meta property="og:url" content="${esc(pageUrl(routePath))}">`);
  if (ALLOW_INDEXING && SITE_URL && !notFound) tags.push(`<link rel="canonical" href="${esc(pageUrl(routePath))}">`);
  if (routePath === pages.home.path || routePath === pages.contact.path) tags.push(structuredData());
  return tags.join('\n    ');
}

function write(file, html) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function build(routePath, { notFound = false } = {}) {
  const page = notFound ? pages.notFound : findPageByPath(routePath);
  const appHtml = render(notFound ? '/__404__' : routePath);
  return template.replace('<!--app-head-->', head(page, routePath, { notFound })).replace('<!--app-html-->', appHtml);
}

let count = 0;
for (const routePath of prerenderPaths) {
  const html = build(routePath);
  if (routePath === '/') {
    write(path.join(dist, 'index.html'), html);
  } else {
    const rel = routePath.replace(/^\//, '');
    write(path.join(dist, `${rel}.html`), html);
    write(path.join(dist, rel, 'index.html'), html);
  }
  count++;
}
write(path.join(dist, '404.html'), build('/404', { notFound: true }));

// Search engines: only on an authorised production domain.
if (ALLOW_INDEXING && SITE_URL) {
  const urls = prerenderPaths.map((p) => `  <url><loc>${esc(pageUrl(p))}</loc></url>`).join('\n');
  write(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  write(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: ${count} routes + 404.html → dist/ (${ALLOW_INDEXING ? 'indexable' : 'noindex'}${SITE_URL ? `, ${SITE_URL}` : ''})`);
