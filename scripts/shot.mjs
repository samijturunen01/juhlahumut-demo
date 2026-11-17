/**
 * shot.mjs – development helper for visual review.
 *
 *   node scripts/shot.mjs <url> <out.png> [--w=1440] [--h=900] [--full] [--wait=3600]
 *                         [--y=1200] [--reduce] [--seen] [--dpr=1] [--frames=6:350]
 *
 *   --full     full-page screenshot (scrolls through the page first so lazy images and reveals settle)
 *   --y        scroll to this offset before capturing
 *   --reduce   emulate prefers-reduced-motion
 *   --seen     mark the homepage intro as already seen for this session
 *   --frames   capture N frames at an interval (ms) from page load – for reviewing animation timing
 */
import { chromium } from '@playwright/test';

const [, , url, out, ...rest] = process.argv;
const opt = Object.fromEntries(rest.map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const width = Number(opt.w ?? 1440);
const height = Number(opt.h ?? 900);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: Number(opt.dpr ?? 1),
  reducedMotion: opt.reduce ? 'reduce' : 'no-preference',
  hasTouch: width < 800,
  isMobile: width < 800,
});
if (opt.seen) await context.addInitScript(() => { try { sessionStorage.setItem('jh-intro', '1'); } catch {} });
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

if (opt.frames) {
  const [n, every] = String(opt.frames).split(':').map(Number);
  await page.goto(url, { waitUntil: 'commit' });
  for (let i = 0; i < n; i++) {
    await page.waitForTimeout(every);
    await page.screenshot({ path: out.replace(/\.png$/, `-${String(i + 1).padStart(2, '0')}.png`) });
  }
} else {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(Number(opt.wait ?? 3600));
  if (opt.full) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(height * 0.7)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(260);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    await page.screenshot({ path: out, fullPage: true });
  } else {
    if (opt.y) {
      const target = Number(opt.y);
      for (let y = 0; y <= target; y += Math.round(height * 0.6)) {
        await page.evaluate((yy) => window.scrollTo(0, yy), Math.min(y, target));
        await page.waitForTimeout(160);
      }
      await page.evaluate((yy) => window.scrollTo(0, yy), target);
      await page.waitForTimeout(1500);
    }
    await page.screenshot({ path: out });
  }
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ out, overflowX: overflow, errors: errors.slice(0, 8) }));
await browser.close();
