/**
 * serve-dist.mjs – serves dist/ the way GitHub Pages does, for local checks and e2e tests.
 *
 *   node scripts/serve-dist.mjs [--port=4173]
 *
 *   /juhlahumut-demo/x        → x, x.html, or x/ (301) + x/index.html
 *   anything else under base  → 404.html with HTTP 404
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const base = (process.env.VITE_BASE_PATH ?? '/juhlahumut-demo/').replace(/\/?$/, '/');
const port = Number(process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

function send(res, status, file) {
  res.writeHead(status, {
    'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
    'Cache-Control': file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  res.end(readFileSync(file));
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === base.slice(0, -1)) {
    res.writeHead(301, { Location: base });
    return res.end();
  }
  if (!pathname.startsWith(base)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found (outside base path)');
  }
  pathname = pathname.slice(base.length);
  const target = path.normalize(path.join(root, pathname));
  if (!target.startsWith(root)) {
    res.writeHead(400);
    return res.end();
  }

  if (pathname === '' || pathname.endsWith('/')) {
    const index = path.join(target, 'index.html');
    if (isFile(index)) return send(res, 200, index);
  } else {
    if (isFile(target)) return send(res, 200, target);
    if (isFile(`${target}.html`)) return send(res, 200, `${target}.html`);
    if (isFile(path.join(target, 'index.html'))) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
      return res.end();
    }
  }
  return send(res, 404, path.join(root, '404.html'));
}).listen(port, () => console.log(`serving dist/ at http://localhost:${port}${base}`));
