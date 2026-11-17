import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { company } from './data/company';
import { imageManifest } from './data/images.generated';
import { menuPriceRange } from './data/menus';
import { rentalExample } from './data/pricing';
import { findPageByPath, pages, prerenderPaths } from './data/site';

/** Used only at build time by scripts/prerender.mjs to turn every route into static HTML. */
export function render(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return renderToString(
    <StrictMode>
      <StaticRouter location={`${base}${pathname}`} basename={base || undefined}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

export { company, findPageByPath, imageManifest, menuPriceRange, pages, prerenderPaths, rentalExample };
export const baseUrl = import.meta.env.BASE_URL;
