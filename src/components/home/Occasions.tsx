import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { occasions } from '@/data/occasions';
import { pages } from '@/data/site';
import { cx } from '@/lib/format';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Occasions as an editorial index rather than a grid of cards.
 * With a mouse, a photograph follows the cursor and changes with the row;
 * on touch screens each row carries its own thumbnail instead.
 */
export function Occasions() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = preview.current;
      const area = root.current;
      if (!el || !area) return;
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine) and (min-width: 1024px)', () => {
        gsap.set(el, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
          const rect = area.getBoundingClientRect();
          xTo(e.clientX - rect.left);
          yTo(e.clientY - rect.top);
        };
        area.addEventListener('pointermove', onMove);
        return () => area.removeEventListener('pointermove', onMove);
      });
    },
    { scope: root },
  );

  return (
    <section className="theme-cream grain relative overflow-clip" aria-labelledby="occasions-title">
      <div className="shell section relative z-10">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal="up">
              Tilaisuudet
            </p>
            <h2 id="occasions-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
              Syy juhlaan <em>löytyy aina.</em>
            </h2>
          </div>
          <p className="lede lg:col-span-5 lg:pb-2" data-reveal="up" data-reveal-delay="0.1">
            Sama talo taipuu työporukan pikkujouluihin, polttareihin ja rauhalliseen saunailtaan. Valitse tilaisuus, niin lomake on valmiiksi oikealla
            raiteella.
          </p>
        </div>

        <div ref={root} className="relative mt-14 lg:mt-20" onPointerLeave={() => setActive(null)}>
          <ul className="border-t border-(--line-strong)">
            {occasions.map((occasion, index) => (
              <li key={occasion.id} className="border-b border-(--line-strong)" data-reveal="up" data-reveal-delay={String(index * 0.04)}>
                <Link
                  to={occasion.to ?? `${pages.quote.path}?tilaisuus=${occasion.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-5 transition-[padding] duration-500 ease-out-expo sm:gap-x-8 lg:grid-cols-[4rem_1.2fr_1fr_auto] lg:py-7 lg:hover:pl-4"
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                >
                  <span className="numeral text-sm text-ash">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(1.5rem,1rem+2.6vw,3.4rem)] font-[340] leading-[1.05] tracking-tight transition-colors duration-300 group-hover:text-rust">
                      {occasion.name}
                    </span>
                    <span className="mt-1.5 block text-[0.92rem] leading-snug text-ash lg:hidden">{occasion.line}</span>
                  </span>
                  <span className="hidden text-[0.98rem] leading-snug text-ash lg:block">{occasion.line}</span>
                  <span className="flex items-center gap-4">
                    <span className="frame block size-14 shrink-0 rounded-full sm:size-16 lg:hidden" aria-hidden="true">
                      <Picture slug={occasion.image} alt="" sizes="64px" position={occasion.imagePosition} />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 shrink-0 text-ash transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-rust max-sm:hidden"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Cursor-following photograph (pointer devices only) */}
          <div
            ref={preview}
            aria-hidden="true"
            className={cx(
              'pointer-events-none absolute left-0 top-0 z-20 hidden w-[19rem] transition-[opacity,scale] duration-500 ease-out-expo lg:block xl:w-[22rem]',
              active === null ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
            )}
          >
            <div className="frame aspect-[4/5] rotate-3 rounded-lg shadow-2xl shadow-ink/40">
              {occasions.map((occasion, index) => (
                <div key={occasion.id} className={cx('absolute inset-0 transition-opacity duration-500', active === index ? 'opacity-100' : 'opacity-0')}>
                  <Picture slug={occasion.image} alt="" sizes="352px" position={occasion.imagePosition} className="block size-full" imgClassName="size-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
