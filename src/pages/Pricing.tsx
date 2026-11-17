import { Link } from 'react-router';
import { ArrowRight, CalendarClock, Check, CircleAlert, Info, Wine } from 'lucide-react';
import { PricePanels } from '@/components/pricing/PricePanels';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { menuPriceRange } from '@/data/menus';
import { extras, rentalExample, rentalInclusions, rentalTerms } from '@/data/pricing';
import { pages } from '@/data/site';
import { cx, formatEuro } from '@/lib/format';

const months = ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'];

/** When the published example prices do NOT apply – straight from the conditions on the company's price list. */
const quoteNeeded = [
  { title: 'Yli 30 hengen seurue', text: 'Hinta sovitaan seurueen koon ja tilaisuuden mukaan.' },
  { title: 'Pikkujoulukauden viikonloput', text: 'Marras- ja joulukuun viikonloput eivät kuulu esimerkkihintoihin.' },
  { title: 'Muu kuin klo 16–24', text: 'Muut vuokra-ajat hinnoitellaan erikseen.' },
  { title: 'Catering ja lisäpalvelut', text: 'Menut ja kylpytynnyri lisätään tilavuokran päälle.' },
];

export default function Pricing() {
  const hotTub = extras.find((e) => e.id === 'kylpytynnyri');

  return (
    <>
      <PageHero
        eyebrow="Hinnasto"
        title={
          <>
            Tilavuokra <em>selkeästi.</em>
          </>
        }
        lede="Hinta määräytyy seurueen koon, ajankohdan ja vuokra-ajan mukaan. Alla Juhlahumujen julkaisemat esimerkkihinnat ja ehdot, joihin ne perustuvat – tarkan hinnan saatte aina tarjouksessa."
      >
        <Link to={pages.quote.path} className="btn">
          Pyydä tarjous
          <ArrowRight aria-hidden="true" />
        </Link>
      </PageHero>

      {/* Tiers */}
      <section className="theme-coal grain relative overflow-clip" aria-labelledby="tiers-title">
        <div className="shell section relative z-10 !pt-14 lg:!pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="tiers-title" className="display-sm" data-reveal="up">
              Esimerkkihinnat tilavuokrasta
            </h2>
            <p className="inline-flex items-center gap-2 text-[0.88rem] text-smoke" data-reveal="up">
              <CalendarClock aria-hidden="true" className="size-4 text-ember" />
              {rentalExample.timeWindow}, pikkujoulukauden ulkopuolella
            </p>
          </div>
          <PricePanels className="mt-8" />
        </div>
      </section>

      {/* When the example applies */}
      <section className="theme-cream grain relative overflow-clip" aria-labelledby="when-title">
        <div className="shell section relative z-10">
          <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow" data-reveal="up">
                Milloin esimerkkihinnat pätevät
              </p>
              <h2 id="when-title" className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
                Ilta kello 16–24, <em>pikkujoulukauden ulkopuolella.</em>
              </h2>
              <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ash" data-reveal="up" data-reveal-delay="0.1">
                {rentalExample.conditions} {rentalExample.otherTimes}
              </p>
            </div>

            <div className="space-y-12 lg:col-span-7" data-reveal="up" data-reveal-delay="0.1">
              {/* Time window */}
              <figure>
                <figcaption className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash">Vuokra-aika esimerkkihinnoissa</figcaption>
                <div className="relative mt-5" aria-hidden="true">
                  <div className="flex h-14 overflow-hidden rounded-full ring-1 ring-ink/15">
                    <div className="hatch flex-[16] bg-sand/40" />
                    <div className="flex flex-[8] items-center justify-center bg-ink text-[0.85rem] font-semibold text-cream">klo 16–24</div>
                  </div>
                  <div className="relative mt-2 h-4 text-[0.75rem] text-ash tabular">
                    {[0, 6, 12, 16, 24].map((hour) => (
                      <span
                        key={hour}
                        className={cx('absolute top-0', hour === 0 ? 'left-0' : hour === 24 ? 'right-0' : '-translate-x-1/2', hour === 16 && 'font-semibold text-ink')}
                        style={hour > 0 && hour < 24 ? { left: `${(hour / 24) * 100}%` } : undefined}
                      >
                        {String(hour).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="sr-only">Esimerkkihinnat koskevat vuokra-aikaa kello 16–24. Muut ajat sovitaan erikseen.</p>
              </figure>

              {/* Season */}
              <figure>
                <figcaption className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash">Vuoden aikana</figcaption>
                <ol className="mt-5 grid grid-cols-6 gap-1.5 sm:grid-cols-12" aria-label="Kuukaudet, joina esimerkkihinnat ovat voimassa">
                  {months.map((month, index) => {
                    const season = index >= 10;
                    return (
                      <li
                        key={month}
                        className={cx(
                          'flex h-16 flex-col justify-between rounded-md px-2 py-2 text-[0.72rem] font-semibold',
                          season ? 'hatch-strong bg-rust/10 text-rust ring-1 ring-rust/40' : 'bg-ink text-cream',
                        )}
                      >
                        <span className="capitalize">{month}</span>
                        <span className="sr-only">{season ? ': viikonloput sopimuksen mukaan, arkipäivät esimerkkihinnoin' : ': esimerkkihinnat'}</span>
                        {season && (
                          <span aria-hidden="true" className="text-[0.62rem] font-medium leading-tight">
                            vkl erikseen
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.82rem] text-ash" aria-hidden="true">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded-sm bg-ink" /> Esimerkkihinnat
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="hatch-strong size-3 rounded-sm ring-1 ring-rust/40" /> Pikkujoulukausi: viikonloput sopimuksen mukaan
                  </span>
                </div>
              </figure>
            </div>
          </div>

          <div className="mt-20 lg:mt-28">
            <h2 className="display-sm" data-reveal="up">
              Milloin tarvitset tarjouksen?
            </h2>
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {quoteNeeded.map((item, index) => (
                <li key={item.title} className="border-t border-(--line-strong) pt-5 pb-8" data-reveal="up" data-reveal-delay={String(index * 0.06)}>
                  <span className="numeral text-sm text-rust">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-display text-[1.35rem] leading-tight tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-ash">{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ash" data-reveal="up">
              Tarjouspyyntö ei sido mihinkään. Kerro toivomasi päivä ja seurueen koko, niin hinta lasketaan juuri teidän tilaisuudellenne.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="theme-night grain relative overflow-clip" aria-labelledby="included-title">
        <div className="disc-glow -right-[25vw] top-[20%] h-[36vw] w-[80vw] opacity-40" aria-hidden="true" />
        <div className="shell section relative z-10 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal="up">
              Tilavuokraan sisältyy
            </p>
            <h2 id="included-title" className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
              Sauna, pelit, lasit <em>ja loppusiivous.</em>
            </h2>
            <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-smoke" data-reveal="up" data-reveal-delay="0.1">
              Nämä kuuluvat tilavuokraan sellaisenaan. Astiat ja tarjoilukulhot sisältyvät silloin, kun tilaukseen kuuluu myös ruoat.
            </p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
            {rentalInclusions.map((item, index) => (
              <li key={item.id} className="flex items-start gap-3.5 border-t border-(--line) py-4" data-reveal="up" data-reveal-delay={String((index % 2) * 0.05)}>
                <span
                  className={cx(
                    'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full',
                    item.conditional ? 'border border-ember/70 text-ember' : 'bg-ember text-night',
                  )}
                  aria-hidden="true"
                >
                  {item.conditional ? <Info className="size-3.5" /> : <Check className="size-3.5" strokeWidth={2.6} />}
                </span>
                <span className="text-[1rem]">
                  {item.label}
                  {item.detail && (
                    <span className={cx('mt-0.5 block text-[0.86rem] leading-snug', item.conditional ? 'text-glow' : 'text-smoke')}>{item.detail}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Extras + terms */}
      <section className="theme-paper grain relative overflow-clip" aria-labelledby="extras-title">
        <div className="shell section relative z-10">
          <div className="grid gap-x-14 gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow" data-reveal="up">
                Erikseen hinnoiteltavat
              </p>
              <h2 id="extras-title" className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
                Lisää iltaan <em>halutessanne.</em>
              </h2>

              <div className="mt-10 space-y-4">
                {hotTub && (
                  <article className="grid gap-6 rounded-2xl bg-ink p-7 text-cream sm:grid-cols-[1fr_auto] sm:items-end sm:p-9" data-reveal="up">
                    <div>
                      <h3 className="font-display text-[1.75rem] leading-tight tracking-tight">{hotTub.name}</h3>
                      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-smoke">{hotTub.summary}</p>
                      {hotTub.note && <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ember">{hotTub.note}</p>}
                    </div>
                    <p className="sm:text-right">
                      <span className="numeral text-[3.4rem] leading-none">{hotTub.priceInclVat}</span>
                      <span className="ml-1 font-display text-2xl text-smoke">€</span>
                      <span className="block text-[0.82rem] text-smoke">sis. alv</span>
                    </p>
                  </article>
                )}
                <article className="grid gap-6 rounded-2xl bg-[#fbf6ee] p-7 ring-1 ring-ink/10 sm:grid-cols-[1fr_auto] sm:items-end sm:p-9" data-reveal="up" data-reveal-delay="0.06">
                  <div>
                    <h3 className="font-display text-[1.75rem] leading-tight tracking-tight">Catering</h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ash">
                      Valmiit juhlamenut ja pikkujoulumenut. Jälkiruoat ja iltapalat sopimuksen mukaan.
                    </p>
                    <Link to={pages.catering.path} className="link-line mt-4 text-[0.92rem]">
                      Tutustu menuihin
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                  <p className="sm:text-right">
                    <span className="numeral text-[2.6rem] leading-none">
                      {menuPriceRange.min}–{menuPriceRange.max}
                    </span>
                    <span className="ml-1 font-display text-xl text-ash">€</span>
                    <span className="block text-[0.82rem] text-ash">henkilöä kohden</span>
                  </p>
                </article>
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="eyebrow" data-reveal="up">
                Ehdot
              </p>
              <h2 className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
                Hyvä tietää <em>etukäteen.</em>
              </h2>
              <dl className="mt-10 space-y-3">
                <div className="rounded-2xl border border-(--line-strong) p-6" data-reveal="up">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Wine aria-hidden="true" className="size-5 text-rust" />
                    Omat juomat ja ruoat
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-ash">
                    {rentalTerms.ownDrinks} {rentalTerms.ownFood}
                  </dd>
                </div>
                <div className="rounded-2xl border border-rust/40 bg-rust/[0.06] p-6" data-reveal="up" data-reveal-delay="0.05">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <CircleAlert aria-hidden="true" className="size-5 text-rust" />
                    Peruutusehto
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-ash">{rentalTerms.cancellation.text}</dd>
                  <dd className="mt-5 grid grid-cols-2 gap-3 text-center">
                    <span className="rounded-xl bg-[#fbf6ee] px-3 py-4 ring-1 ring-ink/10">
                      <span className="numeral block text-3xl leading-none">≥ {rentalTerms.cancellation.freeUntilDays} vrk</span>
                      <span className="mt-1.5 block text-[0.78rem] text-ash">ennen: peruutus ilman varausmaksua</span>
                    </span>
                    <span className="rounded-xl bg-ink px-3 py-4 text-cream">
                      <span className="numeral block text-3xl leading-none">{formatEuro(rentalTerms.cancellation.lateFee)}</span>
                      <span className="mt-1.5 block text-[0.78rem] text-smoke">varausmaksu myöhemmin perutessa</span>
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Hinta juuri teidän <em>juhlillenne.</em>
          </>
        }
        text="Kerro toivottu päivä, seurueen koko ja mahdolliset lisäpalvelut. Tarjouspyyntö ei sido mihinkään, eikä se vielä ole varaus."
      />
    </>
  );
}
