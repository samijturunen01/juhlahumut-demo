import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks against the PRODUCTION build, served the way GitHub Pages
 * serves it (scripts/serve-dist.mjs). Run `npm run build` first.
 *
 *   npm run test:e2e
 *   BASE_URL=https://<user>.github.io/juhlahumut-demo npm run test:e2e   # against the live demo
 */
const port = 4173;
const external = process.env.BASE_URL;
const baseURL = (external ?? `http://localhost:${port}/juhlahumut-demo`).replace(/\/?$/, '/');

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: external
    ? undefined
    : {
        command: `node scripts/serve-dist.mjs --port=${port}`,
        url: baseURL,
        reuseExistingServer: true,
      },
});
