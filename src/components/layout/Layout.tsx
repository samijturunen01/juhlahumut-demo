import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { LogoSprite } from '@brand-art';
import { findPageByPath } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const page = findPageByPath(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState('');

  useDocumentMeta(page);
  usePageMotion(mainRef, pathname);

  // Navigation is instant: new pages start at the top (or at their #anchor), back/forward
  // keeps the browser's own scroll restoration. No transition curtains, no delays.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (navigationType === 'POP') return;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
    // Move focus to the new page and tell assistive tech where we are.
    mainRef.current?.focus({ preventScroll: true });
    setAnnouncement(page.title);
  }, [pathname, hash, navigationType, page.title]);

  return (
    <>
      <a href="#main" className="skip-link">
        Siirry sisältöön
      </a>
      <LogoSprite />
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
