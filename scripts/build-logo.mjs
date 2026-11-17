/**
 * build-logo.mjs
 *
 * Derives layered vector geometry from Juhlahumut's ORIGINAL logo bitmap so the
 * mark can be animated layer by layer without redrawing or reinterpreting it.
 *
 *   node scripts/build-logo.mjs [path/to/logo-original.png]
 *
 * What is derived, and how:
 *   - Neon script ("Juhlahumut"): traced 1:1 from the bitmap with potrace
 *     (white tube + red outline). Nothing is redrawn by hand.
 *   - Amber disc: least-squares ellipse fit to the bitmap's outer silhouette.
 *   - Skyline + lit windows: rectilinear geometry, measured from the bitmap
 *     (see SKYLINE below). Parts hidden behind the script are closed with
 *     straight edges, which is what the visible parts imply.
 *
 * Output: src/brand/authentic/logoGeometry.ts (generated – do not edit by hand)
 *         + a flattened preview PNG for visual comparison against the original.
 */
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.argv[2] ?? path.join(root, 'assets-src/brand/logo-original.png'));
const outFile = path.join(root, 'src/brand/authentic/logoGeometry.ts');
const previewDir = process.argv[3] ? path.resolve(process.argv[3]) : null;

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const px = (x, y) => {
  const i = (y * W + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

/* ------------------------------------------------------------------ */
/* 1. Skyline (measured from the bitmap, in bitmap pixels)             */
/* ------------------------------------------------------------------ */
const SKYLINE = [
  [179, 510], [179, 459], [214, 459], [214, 435], [266, 435], [266, 384], [295, 384], [295, 459],
  [303, 459], [303, 258], [331, 258], [331, 435], [339, 435], [339, 384], [367, 384], [367, 410],
  [374, 410], [374, 208], [408, 208], [408, 229], [428, 229], [428, 459], [435, 459], [435, 360],
  [448, 360], [448, 258], [461, 125], [474, 258], [474, 410], [481, 410], [481, 207], [485, 207],
  [485, 187], [491, 187], [508.5, 78], [509, 36], [512, 36], [512.5, 78], [532, 185], [536, 185],
  [536, 205], [540.5, 205], [540.5, 459], [548, 459], [548, 335], [556, 335], [556, 309],
  [572.5, 309], [572.5, 335], [601, 335], [601, 384], [609, 384], [609, 284], [662, 341], [662, 510],
];
const WINDOWS = [
  { x: 388, y: 257, w: 5, h: 11 },
  { x: 400, y: 273, w: 5, h: 11 },
  { x: 518, y: 218, w: 5, h: 12 },
  { x: 501, y: 245, w: 5, h: 15 },
];
const skylinePath = 'M' + SKYLINE.map(([x, y]) => `${x} ${y}`).join('L') + 'Z';

/* ------------------------------------------------------------------ */
/* 2. Disc: fit an ellipse to the silhouette where the disc is the edge */
/* ------------------------------------------------------------------ */
const opaque = (x, y) => px(x, y)[3] > 127;
const pts = [];
// bottom arc – nothing else in the logo reaches below the skyline base (y 510)
for (let x = 120; x < 640; x += 2) {
  for (let y = H - 1; y > 516; y--) if (opaque(x, y)) { pts.push([x, y + 0.5]); break; }
}
// top-right arc – right of the tower, above the script
for (let x = 560; x < 760; x += 2) {
  for (let y = 0; y < 300; y++) if (opaque(x, y)) { if (y > 200) pts.push([x, y - 0.5]); break; }
}
// left tip
for (let y = 500; y < 560; y += 2) {
  for (let x = 0; x < 200; x++) if (opaque(x, y)) { if (x > 110) pts.push([x - 0.5, y]); break; }
}
// right tip
for (let y = 236; y < 300; y += 2) {
  for (let x = W - 1; x > 700; x--) if (opaque(x, y)) { if (x < 800) pts.push([x + 0.5, y]); break; }
}

// Least squares for A x² + B xy + C y² + D x + E y = 1 (coordinates normalised for conditioning)
const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
const sc = 300;
const rows = pts.map(([x, y]) => { const u = (x - mx) / sc, v = (y - my) / sc; return [u * u, u * v, v * v, u, v]; });
const N = 5;
const ATA = Array.from({ length: N }, () => new Array(N + 1).fill(0));
for (const r of rows) for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) ATA[i][j] += r[i] * r[j]; ATA[i][N] += r[i]; }
for (let i = 0; i < N; i++) {
  let p = i;
  for (let k = i + 1; k < N; k++) if (Math.abs(ATA[k][i]) > Math.abs(ATA[p][i])) p = k;
  [ATA[i], ATA[p]] = [ATA[p], ATA[i]];
  for (let k = 0; k < N; k++) if (k !== i) { const f = ATA[k][i] / ATA[i][i]; for (let j = i; j <= N; j++) ATA[k][j] -= f * ATA[i][j]; }
}
const [A, B, C, D, E] = ATA.map((r, i) => r[N] / r[i]);
// centre (in normalised coords)
const det = 4 * A * C - B * B;
const u0 = (B * E - 2 * C * D) / det;
const v0 = (B * D - 2 * A * E) / det;
const F = 1 - (A * u0 * u0 + B * u0 * v0 + C * v0 * v0 + D * u0 + E * v0); // A u'² + B u'v' + C v'² = F
const theta = 0.5 * Math.atan2(B, A - C);
const ct = Math.cos(theta), st = Math.sin(theta);
const l1 = A * ct * ct + B * ct * st + C * st * st;
const l2 = A * st * st - B * ct * st + C * ct * ct;
let r1 = Math.sqrt(F / l1) * sc;
let r2 = Math.sqrt(F / l2) * sc;
let rot = (theta * 180) / Math.PI;
if (r2 > r1) { [r1, r2] = [r2, r1]; rot += 90; }
if (rot > 90) rot -= 180;
if (rot < -90) rot += 180;
const disc = {
  cx: +(u0 * sc + mx).toFixed(2),
  cy: +(v0 * sc + my).toFixed(2),
  rx: +r1.toFixed(2),
  ry: +r2.toFixed(2),
  rotate: +rot.toFixed(2),
};

// Outline thickness: walk inwards from the left tip of the disc along its major axis
// (both ends of the minor axis are hidden behind the skyline).
const rad = (disc.rotate * Math.PI) / 180;
const ax0 = Math.cos(rad), ay0 = Math.sin(rad);
const nx = -Math.sin(rad), ny = Math.cos(rad);
let whiteW = 0, blackW = 0;
{
  const startX = disc.cx - ax0 * (disc.rx + 2);
  const startY = disc.cy - ay0 * (disc.rx + 2);
  let phase = 0;
  for (let t = 0; t < 40; t += 0.25) {
    const x = Math.round(startX + ax0 * t), y = Math.round(startY + ay0 * t);
    const [r, g, b, a] = px(x, y);
    const isBlack = a > 127 && Math.max(r, g, b) < 100;
    const isLight = a > 100 && Math.min(r, g, b) > 150;
    if (phase === 0 && isLight) whiteW += 0.25;
    else if (phase === 0 && isBlack) { phase = 1; blackW += 0.25; }
    else if (phase === 1 && isBlack) blackW += 0.25;
    else if (phase === 1) break;
  }
}
disc.outline = +Math.min(4, Math.max(2.5, whiteW)).toFixed(1);
disc.ring = +Math.min(12, Math.max(3, blackW)).toFixed(1);

// Gradient: measured from the bitmap's fill pixels. It runs vertically in page space
// (regression of fill brightness on x/y gives a direction of -87°), near-white at the top
// of the disc to saturated orange at the bottom.
const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
const gradient = {
  y1: 232,
  y2: 562,
  stops: [
    { offset: 0, color: '#fffaf0' },
    { offset: 0.2, color: '#fed0af' },
    { offset: 0.39, color: '#fdb988' },
    { offset: 0.87, color: '#fd7519' },
    { offset: 1, color: '#f96f14' },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Script: isolate the white tube (enclosed by red) and trace it     */
/* ------------------------------------------------------------------ */
const isWhite = new Uint8Array(W * H);
const isRed = new Uint8Array(W * H);
const redSoft = new Float32Array(W * H);
const whiteSoft = new Float32Array(W * H);
const clamp = (v) => Math.max(0, Math.min(1, v));
const redSamples = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const [r, g, b, a] = px(x, y);
  const i = y * W + x;
  const al = a / 255;
  if (al > 0.5 && Math.min(r, g, b) > 200) isWhite[i] = 1;
  if (al > 0.5 && r > 120 && g < 115 && b < 115 && r - g > 60) isRed[i] = 1;
  redSoft[i] = clamp((r - 80) / 90) * clamp((110 - g) / 60) * al;
  whiteSoft[i] = clamp((Math.min(r, g, b) - 140) / 90) * al;
  if (al > 0.9 && r > 185 && g < 40 && b < 40) redSamples.push([r, g, b]);
}
const neonRed = hex(redSamples.reduce((s, c) => [s[0] + c[0], s[1] + c[1], s[2] + c[2]]).map((v) => Math.round(v / redSamples.length)));

// connected components of white; keep those whose border is (almost) entirely red => the tube
const label = new Int32Array(W * H).fill(-1);
const core = new Uint8Array(W * H);
let nComp = 0;
for (let s = 0; s < W * H; s++) {
  if (!isWhite[s] || label[s] >= 0) continue;
  const stack = [s];
  label[s] = nComp;
  const members = [];
  let redN = 0, otherN = 0;
  while (stack.length) {
    const i = stack.pop();
    members.push(i);
    const x = i % W, y = (i / W) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const X = x + dx, Y = y + dy;
      if (X < 0 || Y < 0 || X >= W || Y >= H) { otherN++; continue; }
      const j = Y * W + X;
      if (isWhite[j]) { if (label[j] < 0 && (dx === 0 || dy === 0)) { label[j] = nComp; stack.push(j); } }
      else {
        // look one pixel further through the anti-aliased rim
        const X2 = Math.max(0, Math.min(W - 1, x + dx * 2)), Y2 = Math.max(0, Math.min(H - 1, y + dy * 2));
        if (isRed[j] || isRed[Y2 * W + X2]) redN++; else otherN++;
      }
    }
  }
  if (members.length > 40 && redN / (redN + otherN) > 0.8) for (const i of members) core[i] = 1;
  nComp++;
}

const dilate = (mask, r) => {
  const out = new Uint8Array(W * H);
  const r2 = r * r;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!mask[y * W + x]) continue;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      const X = x + dx, Y = y + dy;
      if (X >= 0 && Y >= 0 && X < W && Y < H) out[Y * W + X] = 1;
    }
  }
  return out;
};
const core1 = dilate(core, 1);
const core2 = dilate(core, 2);
const core7 = dilate(core, 7);

const coreGray = Buffer.alloc(W * H);
const bodyGray = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  const c = core1[i] ? whiteSoft[i] : 0; // keep the bitmap's own anti-aliasing for smooth contours
  coreGray[i] = Math.round(c * 255);
  const body = core7[i] ? Math.max(redSoft[i], core2[i] ? 1 : 0) : 0;
  bodyGray[i] = Math.round(body * 255);
}

const SCALE = 3;
const traceMask = async (gray, turdSize = 30) => {
  // upscale the soft mask, then threshold – gives smooth contours from anti-aliased pixels
  const up = await sharp(gray, { raw: { width: W, height: H, channels: 1 } })
    .resize(W * SCALE, H * SCALE, { kernel: 'cubic' })
    .blur(2.2)
    .negate() // potrace traces dark-on-light
    .png()
    .toBuffer();
  const d = await new Promise((resolve, reject) => {
    const p = new potrace.Potrace({ threshold: 128, turdSize, optCurve: true, optTolerance: 2.4, alphaMax: 1.3 });
    p.loadImage(up, (err) => (err ? reject(err) : resolve(/ d="([^"]+)"/.exec(p.getPathTag())[1])));
  });
  // scale coordinates back to bitmap pixels
  return d.replace(/-?\d+(\.\d+)?/g, (n) => String(+(Number(n) / SCALE).toFixed(1))).replace(/\s+/g, ' ').trim();
};
const scriptCorePath = await traceMask(coreGray);
const scriptBodyPath = await traceMask(bodyGray);

// horizontal extent of the script (used for the left-to-right "current" sweep)
let sx0 = W, sx1 = 0, sy0 = H, sy1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (core7[y * W + x]) { sx0 = Math.min(sx0, x); sx1 = Math.max(sx1, x); sy0 = Math.min(sy0, y); sy1 = Math.max(sy1, y); }

/* ------------------------------------------------------------------ */
/* 4. Emit                                                             */
/* ------------------------------------------------------------------ */
const geometry = {
  viewBox: { width: W, height: H },
  disc: { ...disc, gradient },
  skylinePath,
  windows: WINDOWS,
  script: { corePath: scriptCorePath, bodyPath: scriptBodyPath, red: neonRed, bounds: { x: sx0, y: sy0, width: sx1 - sx0, height: sy1 - sy0 } },
};

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `/* GENERATED by scripts/build-logo.mjs from the original Juhlahumut logo bitmap – do not edit by hand. */\n` +
    `export const logoGeometry = ${JSON.stringify(geometry, null, 2)} as const;\n`,
);
console.log('disc', disc, 'red', neonRed);
console.log('script core path chars', scriptCorePath.length, 'body', scriptBodyPath.length, 'bounds', geometry.script.bounds);
console.log('wrote', path.relative(root, outFile));

if (previewDir) {
  const g = geometry;
  const grad = g.disc.gradient.stops.map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join('');
  const d = g.disc;
  const flat = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="${g.disc.gradient.y1}" x2="0" y2="${g.disc.gradient.y2}" gradientTransform="rotate(${-d.rotate} ${d.cx} ${d.cy})">${grad}</linearGradient></defs>
  <g transform="rotate(${d.rotate} ${d.cx} ${d.cy})">
    <ellipse cx="${d.cx}" cy="${d.cy}" rx="${d.rx}" ry="${d.ry}" fill="#fff"/>
  </g>
  <path d="${g.skylinePath}" fill="#fff" stroke="#fff" stroke-width="${d.outline * 2}" stroke-linejoin="miter"/>
  <g transform="rotate(${d.rotate} ${d.cx} ${d.cy})">
    <ellipse cx="${d.cx}" cy="${d.cy}" rx="${d.rx - d.outline}" ry="${d.ry - d.outline}" fill="#000"/>
    <ellipse cx="${d.cx}" cy="${d.cy}" rx="${d.rx - d.outline - d.ring}" ry="${d.ry - d.outline - d.ring}" fill="url(#g)"/>
  </g>
  <path d="${g.skylinePath}" fill="#000"/>
  ${g.windows.map((w) => `<rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" fill="#f47b20"/>`).join('')}
  <path d="${g.script.bodyPath}" fill="${g.script.red}" fill-rule="evenodd"/>
  <path d="${g.script.corePath}" fill="#fff" fill-rule="evenodd"/>
</svg>`;
  mkdirSync(previewDir, { recursive: true });
  await sharp(Buffer.from(flat('#0d0a09'))).png().toFile(path.join(previewDir, 'rebuilt-on-dark.png'));
  // side-by-side difference view: original over the same background
  const orig = await sharp({ create: { width: W, height: H, channels: 4, background: '#0d0a09' } }).composite([{ input: src }]).png().toBuffer();
  await sharp(orig).composite([{ input: await sharp(Buffer.from(flat('#0d0a09'))).png().toBuffer(), blend: 'difference' }]).png().toFile(path.join(previewDir, 'difference.png'));
  console.log('preview written to', previewDir);
}
