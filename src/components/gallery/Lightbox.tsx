import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/data/images.generated';
import { cx } from '@/lib/format';

export interface LightboxItem {
  slug: ImageSlug;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Accessible name of the viewer, e.g. "Galleria". */
  label?: string;
}

const SWIPE_THRESHOLD = 48;

/**
 * Full-screen photo viewer.
 *
 *  - Keyboard: ← / → browse, Home / End jump, Esc closes. Focus is trapped inside
 *    and returned to the thumbnail that opened it.
 *  - Touch: horizontal swipe browses (the photo follows the finger); vertical swipe down closes.
 *  - Rendered in a portal on <body>; the page behind is made inert and stops scrolling.
 *  - Neighbouring photos are preloaded so browsing feels instant.
 */
export function Lightbox({ items, index, onIndexChange, onClose, label = 'Kuvakatselu' }: LightboxProps) {
  const open = index !== null && items.length > 0;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const start = useRef<{ x: number; y: number; id: number } | null>(null);

  const count = items.length;
  const current = open ? Math.min(Math.max(index, 0), count - 1) : 0;

  const go = useCallback(
    (delta: 1 | -1) => {
      if (!open) return;
      setDirection(delta);
      onIndexChange((current + delta + count) % count);
    },
    [open, current, count, onIndexChange],
  );

  const jump = useCallback(
    (target: number) => {
      if (!open || target === current) return;
      setDirection(target > current ? 1 : -1);
      onIndexChange(target);
    },
    [open, current, onIndexChange],
  );

  // Open / close side effects: focus, inert background, scroll lock.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    root?.setAttribute('inert', '');
    html.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      root?.removeAttribute('inert');
      html.style.overflow = previousOverflow;
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowRight':
          e.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          go(-1);
          break;
        case 'Home':
          e.preventDefault();
          jump(0);
          break;
        case 'End':
          e.preventDefault();
          jump(count - 1);
          break;
        case 'Tab': {
          // Focus trap
          const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
          if (!focusables || focusables.length === 0) return;
          const first = focusables[0]!;
          const last = focusables[focusables.length - 1]!;
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, jump, onClose, count]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLElement>(`[data-thumb="${current}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [open, current]);

  if (!open || typeof document === 'undefined') return null;

  const item = items[current]!;
  const prev = items[(current - 1 + count) % count]!;
  const next = items[(current + 1) % count]!;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setDrag({ x: Math.abs(dx) > Math.abs(dy) ? dx : 0, y: Math.abs(dy) > Math.abs(dx) && dy > 0 ? dy : 0, active: true });
  };
  const onPointerEnd = () => {
    if (!start.current) return;
    start.current = null;
    const { x, y } = drag;
    setDrag({ x: 0, y: 0, active: false });
    if (y > SWIPE_THRESHOLD * 2) onClose();
    else if (x < -SWIPE_THRESHOLD) go(1);
    else if (x > SWIPE_THRESHOLD) go(-1);
  };

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="lightbox theme-night fixed inset-0 z-[100] flex flex-col bg-night/97 text-cream"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <p className="numeral text-sm tracking-widest text-smoke" aria-live="polite">
          <span className="text-cream">{String(current + 1).padStart(2, '0')}</span>
          <span className="mx-2 text-ember">/</span>
          {String(count).padStart(2, '0')}
          <span className="sr-only">. {item.caption ?? item.alt}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-12 place-items-center rounded-full border border-cream/20 transition-colors hover:border-ember hover:text-ember"
          aria-label="Sulje kuvakatselu"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-3 py-4 sm:px-20 lg:px-28"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <figure
          key={item.slug}
          className="lightbox-photo flex h-full max-h-full w-full flex-col items-center justify-center"
          data-direction={direction}
          style={{
            transform: drag.active ? `translate3d(${drag.x}px, ${drag.y}px, 0)` : undefined,
            opacity: drag.active && drag.y ? Math.max(0.35, 1 - drag.y / 400) : undefined,
            transition: drag.active ? 'none' : undefined,
          }}
        >
          <Picture
            slug={item.slug}
            alt={item.alt}
            sizes="(min-width: 1024px) 80vw, 100vw"
            priority
            className="flex min-h-0 w-full flex-1 items-center justify-center"
            imgClassName="max-h-full w-auto max-w-full rounded-sm object-contain shadow-2xl shadow-black/60 select-none"
          />
          {item.caption && <figcaption className="mt-4 shrink-0 text-center font-display text-lg italic text-cream/90 sm:text-xl">{item.caption}</figcaption>}
        </figure>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-night/40 transition-colors hover:border-ember hover:text-ember sm:grid lg:left-6"
          aria-label={`Edellinen kuva: ${prev.caption ?? prev.alt}`}
        >
          <ChevronLeft aria-hidden="true" className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-night/40 transition-colors hover:border-ember hover:text-ember sm:grid lg:right-6"
          aria-label={`Seuraava kuva: ${next.caption ?? next.alt}`}
        >
          <ChevronRight aria-hidden="true" className="size-6" />
        </button>
      </div>

      {/* Bottom: mobile arrows + thumbnails */}
      <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-3 pb-3 sm:hidden">
          <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full border border-cream/20" aria-label="Edellinen kuva">
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <span className="text-xs text-smoke">Pyyhkäise selataksesi</span>
          <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full border border-cream/20" aria-label="Seuraava kuva">
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
        {count > 1 && (
          <ul className="no-scrollbar mx-auto hidden max-w-full gap-2 overflow-x-auto px-6 pb-1 sm:flex sm:justify-center-safe" aria-label="Pikkukuvat">
            {items.map((thumb, i) => (
              <li key={thumb.slug} className="shrink-0">
                <button
                  type="button"
                  data-thumb={i}
                  onClick={() => jump(i)}
                  aria-label={`Kuva ${i + 1}: ${thumb.caption ?? thumb.alt}`}
                  aria-current={i === current ? 'true' : undefined}
                  className={cx(
                    'frame block h-14 w-20 rounded-sm transition-[opacity,box-shadow] duration-300',
                    i === current ? 'opacity-100 ring-2 ring-ember' : 'opacity-45 hover:opacity-90',
                  )}
                >
                  <Picture slug={thumb.slug} alt="" sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preload neighbours */}
      <div className="hidden" aria-hidden="true">
        <Picture slug={prev.slug} alt="" sizes="(min-width: 1024px) 80vw, 100vw" priority />
        <Picture slug={next.slug} alt="" sizes="(min-width: 1024px) 80vw, 100vw" priority />
      </div>
    </div>,
    document.body,
  );
}
