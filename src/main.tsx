import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import './styles/index.css';

declare global {
  interface Window {
    __jhFailsafe?: number;
  }
}

const container = document.getElementById('root') as HTMLElement;
// "/juhlahumut-demo/" -> "/juhlahumut-demo"; "/" -> undefined
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The app is alive – cancel the "bundle never arrived" failsafe set in index.html.
window.clearTimeout(window.__jhFailsafe);

// Production pages are prerendered to static HTML and hydrated; the dev server starts from an empty root.
if (container.hasChildNodes() && container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
