import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ArrowRight, ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { LogoScript } from '@brand-art';
import { company } from '@/data/company';
import { mainNav, pages } from '@/data/site';
import { cx } from '@/lib/format';
import { DemoBadge } from './DemoBadge';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Solid backdrop once the page has moved – one passive listener, one rAF per frame at most.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Navigating always closes the menu.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the menu is open: lock scrolling, make the page behind inert, close on Escape.
  useEffect(() => {
    const root = document.documentElement;
    const behind = [document.getElementById('main'), document.getElementById('site-footer')];
    root.style.overflow = open ? 'hidden' : '';
    behind.forEach((el) => el?.toggleAttribute('inert', open));
    if (!open) return;

    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      root.style.overflow = '';
      behind.forEach((el) => el?.removeAttribute('inert'));
    };
  }, [open, close]);

  // Never leave the menu open when the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
    <header
      className={cx(
        'no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open ? 'border-b border-cream/10 bg-night/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="shell flex h-(--header-h) items-center justify-between gap-6">
        <div className="relative z-10 flex items-center gap-3 lg:gap-4">
          <Link to="/" className="-ml-1 flex items-center rounded-sm p-1" aria-label="Juhlahumut – etusivulle">
            <span data-intro="mark" className="block">
              <LogoScript decorative className="neon-glow block h-[1.9rem] w-auto lg:h-[2.35rem]" />
            </span>
          </Link>
          <DemoBadge />
        </div>

        <nav aria-label="Päävalikko" className="hidden lg:block">
          <ul className="flex items-center gap-x-8 xl:gap-x-10">
            {mainNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cx(
                      'group relative block py-2 text-[0.93rem] font-medium tracking-wide transition-colors duration-300',
                      isActive ? 'text-cream' : 'text-cream/70 hover:text-cream',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.nav}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ember transition-transform duration-500 ease-out-expo',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={company.phone.href}
            className="hidden items-center gap-2 text-[0.93rem] font-medium text-cream/80 transition-colors hover:text-cream xl:inline-flex"
          >
            <Phone aria-hidden="true" className="size-4 text-ember" />
            <span className="tabular">{company.phone.display}</span>
          </a>
          <Link to={pages.quote.path} className="btn btn--sm hidden sm:inline-flex">
            Pyydä tarjous
            <ArrowRight aria-hidden="true" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="relative -mr-2 grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-6">
              <span
                className={cx(
                  'absolute inset-x-0 top-0 h-px bg-cream transition-transform duration-500 ease-out-expo',
                  open && 'translate-y-[7px] rotate-45',
                )}
              />
              <span
                className={cx(
                  'absolute inset-x-0 bottom-0 h-px bg-cream transition-transform duration-500 ease-out-expo',
                  open && '-translate-y-[6px] -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

    </header>

      {/* Mobile menu – purpose-built, not a shrunken desktop bar.
          Rendered beside the header (not inside it): the header's backdrop-filter would
          otherwise become the containing block of this fixed panel. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Valikko"
        inert={!open}
        className={cx(
          'theme-night fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto overscroll-contain transition-[opacity,visibility] duration-500 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="disc-glow -right-1/3 top-1/4 h-[40vh] w-[130vw] opacity-60" aria-hidden="true" />
        <div className="shell relative flex min-h-full flex-col justify-between gap-10 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
          <nav aria-label="Mobiilivalikko">
            <ul>
              {[pages.home, ...mainNav, pages.meetings].map((item, index) => (
                <li
                  key={item.path}
                  className={cx(
                    'border-b border-cream/10 transition-[opacity,transform] duration-700 ease-out-expo',
                    open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
                  )}
                  style={{ transitionDelay: open ? `${90 + index * 55}ms` : '0ms' }}
                >
                  <NavLink
                    ref={index === 0 ? firstLinkRef : undefined}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      cx('flex items-baseline justify-between gap-4 py-4 font-display text-[2rem] leading-none tracking-tight', isActive ? 'text-ember' : 'text-cream')
                    }
                  >
                    <span>{item.nav}</span>
                    <span aria-hidden="true" className="numeral text-xs tracking-widest text-cream/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={cx('space-y-5 transition-opacity duration-700', open ? 'opacity-100' : 'opacity-0')}
            style={{ transitionDelay: open ? '520ms' : '0ms' }}
          >
            <Link to={pages.quote.path} className="btn w-full">
              Pyydä tarjous
              <ArrowRight aria-hidden="true" />
            </Link>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <a href={company.phone.href} className="flex items-center gap-2.5 rounded-xl border border-cream/15 px-4 py-3.5">
                <Phone aria-hidden="true" className="size-4 shrink-0 text-ember" />
                <span className="tabular font-medium">{company.phone.display}</span>
              </a>
              <a href={company.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-cream/15 px-4 py-3.5">
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-ember" />
                <span className="font-medium">{company.address.street}</span>
              </a>
            </div>
            <ul className="flex gap-6 text-sm text-smoke">
              {company.social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                    {s.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
