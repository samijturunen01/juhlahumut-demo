import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { rentalExample } from '@/data/pricing';
import { pages } from '@/data/site';
import { cx, formatEuroExact } from '@/lib/format';

/**
 * The three published rental tiers, side by side. The conditions that scope the
 * example prices are part of the component itself, so the numbers can never be
 * shown without them.
 */
export function PricePanels({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-(--line) bg-(--line) md:grid-cols-3">
        {rentalExample.tiers.map((tier, index) => (
          <li
            key={tier.id}
            className="relative flex flex-col bg-(--bg) p-7 sm:p-9 lg:p-10"
            data-reveal="up"
            data-reveal-delay={String(index * 0.08)}
          >
            <p className="eyebrow eyebrow--plain">Esimerkkihinta</p>
            <h3 className="display-sm mt-4">{tier.label}</h3>

            {tier.priceInclVat !== null ? (
              <>
                <p className="mt-8 flex items-baseline gap-2">
                  <span className="numeral text-[clamp(3.4rem,2.2rem+4.2vw,5.5rem)] leading-none">{tier.priceInclVat}</span>
                  <span className="font-display text-3xl font-light text-(--muted)">€</span>
                </p>
                <p className="mt-3 text-[0.9rem] text-(--muted)">
                  sis. alv
                  {tier.priceExclVat !== null && (
                    <>
                      <span className="mx-2 opacity-50">·</span>
                      <span className="tabular">{formatEuroExact(tier.priceExclVat)}</span> alv 0 %
                    </>
                  )}
                </p>
              </>
            ) : (
              <>
                <p className="mt-8 font-display text-[clamp(2rem,1.5rem+1.9vw,2.9rem)] font-light italic leading-[1.05] tracking-tight">Sopimuksen mukaan</p>
                <p className="mt-3 text-[0.9rem] text-(--muted)">{tier.note}</p>
              </>
            )}

            <div className={cx('mt-auto pt-9', tier.priceInclVat === null && 'pt-7')}>
              <p className="flex items-center justify-between gap-3 border-t border-(--line) pt-4 text-[0.86rem] text-(--muted)">
                <span>Tilavuokra</span>
                <span className="tabular">{rentalExample.timeWindow}</span>
              </p>
              <Link
                to={`${pages.quote.path}?henkilot=${tier.id}`}
                className="link-line mt-5 text-[0.92rem]"
                aria-label={`Pyydä tarjous: ${tier.label}`}
              >
                Pyydä tarjous
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-3xl text-[0.9rem] leading-relaxed text-(--muted)" data-reveal="up">
        <strong className="font-semibold text-(--fg)">Hinnat ovat esimerkkejä.</strong> {rentalExample.conditions} {rentalExample.otherTimes}
      </p>
    </div>
  );
}
