import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { PricePanels } from '@/components/pricing/PricePanels';
import { extras, rentalInclusions, rentalTerms } from '@/data/pricing';
import { pages } from '@/data/site';

export function PricingPreview() {
  const hotTub = extras.find((e) => e.id === 'kylpytynnyri');
  return (
    <section className="theme-coal grain relative overflow-clip" aria-labelledby="pricing-title">
      <div className="disc-glow -left-[30vw] top-[30%] h-[40vw] w-[90vw] opacity-40" aria-hidden="true" />
      <div className="shell section relative z-10">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal="up">
              Hinnasto
            </p>
            <h2 id="pricing-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
              Mitä ilta <em>maksaa?</em>
            </h2>
          </div>
          <p className="lede lg:col-span-5 lg:pb-2" data-reveal="up" data-reveal-delay="0.1">
            Tilavuokra määräytyy seurueen koon mukaan. Alla esimerkkihinnat tavalliselle illalle – tarkan hinnan saatte tarjouksessa.
          </p>
        </div>

        <PricePanels className="mt-12 lg:mt-16" />

        <div className="mt-16 grid gap-x-12 gap-y-12 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="display-sm" data-reveal="up">
              Tilavuokraan sisältyy
            </h3>
            <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
              {rentalInclusions.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 border-t border-(--line) py-3.5 text-[0.98rem]"
                  data-reveal="up"
                  data-reveal-delay={String((index % 2) * 0.05)}
                >
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-ember" />
                  <span>
                    {item.label}
                    {item.detail && <span className="mt-0.5 block text-[0.84rem] leading-snug text-(--muted)">{item.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="display-sm" data-reveal="up">
              Hyvä tietää
            </h3>
            <dl className="mt-7 space-y-6 text-[0.98rem] leading-relaxed">
              {hotTub && (
                <div className="border-t border-(--line) pt-4" data-reveal="up">
                  <dt className="flex items-baseline justify-between gap-4 font-semibold">
                    <span>Kylpytynnyri lisäpalveluna</span>
                    <span className="numeral text-xl font-normal text-ember">{hotTub.priceLabel}</span>
                  </dt>
                  <dd className="mt-1.5 text-(--muted)">{hotTub.summary}</dd>
                </div>
              )}
              <div className="border-t border-(--line) pt-4" data-reveal="up" data-reveal-delay="0.05">
                <dt className="font-semibold">Omat juomat ja ruoat</dt>
                <dd className="mt-1.5 text-(--muted)">
                  {rentalTerms.ownDrinks} {rentalTerms.ownFood}
                </dd>
              </div>
              <div className="border-t border-(--line) pt-4" data-reveal="up" data-reveal-delay="0.1">
                <dt className="font-semibold">Peruutusehto</dt>
                <dd className="mt-1.5 text-(--muted)">{rentalTerms.cancellation.text}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row" data-reveal="up">
          <Link to={pages.quote.path} className="btn">
            Pyydä tarjous
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link to={pages.pricing.path} className="btn btn--ghost">
            Katso koko hinnasto
          </Link>
        </div>
      </div>
    </section>
  );
}
