import { useEffect, useRef, useState } from 'react';
import { company, demoNotice } from '@/data/company';

/**
 * Persistent marker that this is a redesign concept and not the company's
 * official website. It sits in the header on every page and opens a short
 * explanation on demand.
 */
export function DemoBadge() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="demo-notice"
        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-cream/25 px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream/80 transition-colors hover:border-ember hover:text-cream"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
        Demo
        <span className="sr-only"> – {demoNotice.short}, {open ? 'sulje lisätiedot' : 'näytä lisätiedot'}</span>
      </button>
      <div
        id="demo-notice"
        role="note"
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-3 w-[min(19rem,calc(100vw-2.5rem))] rounded-2xl border border-cream/15 bg-night p-4 text-[0.82rem] leading-relaxed text-smoke shadow-2xl shadow-black/60"
      >
        <p>
          <strong className="font-semibold text-cream">{demoNotice.short}.</strong> {demoNotice.long}
        </p>
        <p className="mt-2">
          Virallinen sivusto:{' '}
          <a href={company.officialSiteUrl} rel="noreferrer" className="prose-link text-cream">
            juhlahumut.fi
          </a>
        </p>
      </div>
    </div>
  );
}
