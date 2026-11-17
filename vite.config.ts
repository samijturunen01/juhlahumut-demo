import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Base path. GitHub Pages serves project sites from /<repository>/, so the
 * demo defaults to /juhlahumut-demo/. Override with VITE_BASE_PATH=/ when the
 * site is eventually hosted at a domain root.
 */
const base = process.env.VITE_BASE_PATH ?? '/juhlahumut-demo/';

/**
 * Brand artwork switch.
 *
 * The authentic Juhlahumut logo lives in src/brand/authentic/. If that folder
 * is absent (for example because the right to republish the logo has not been
 * confirmed and it was left out of the repository) or VITE_BRAND_LOGO=wordmark
 * is set, the build falls back to a neutral typographic wordmark so nothing
 * unlicensed is ever shipped.
 */
const authenticArt = fromRoot('./src/brand/authentic/LogoArt.tsx');
const useAuthenticLogo = process.env.VITE_BRAND_LOGO !== 'wordmark' && existsSync(authenticArt);

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@brand-art': useAuthenticLogo ? authenticArt : fromRoot('./src/brand/fallback/LogoArt.tsx'),
      '@': fromRoot('./src'),
    },
  },
  optimizeDeps: {
    // Pre-bundle everything in one pass. Otherwise the dev server discovers some of these late,
    // re-optimises, and briefly serves two copies of React ("Invalid hook call").
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-router', 'gsap', 'gsap/ScrollTrigger', '@gsap/react', 'lucide-react'],
  },
  build: {
    target: 'es2022',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
          return undefined;
        },
      },
    },
  },
  ssr: {
    // Bundle these into the prerender build so Node does not have to resolve their ESM/CJS entry points.
    noExternal: ['gsap', '@gsap/react', 'lucide-react'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
