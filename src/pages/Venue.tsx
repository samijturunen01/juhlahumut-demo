import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Check, Expand } from 'lucide-react';
import { Lightbox } from '@/components/gallery/Lightbox';
import { AmenityIcon } from '@/components/ui/AmenityIcon';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { rentalExample } from '@/data/pricing';
import { pages } from '@/data/site';
import { amenities, spaces, venueFacts, type Space } from '@/data/venue';
import { cx, formatEuro } from '@/lib/format';

const themes: Record<Space['id'], string> = {
  sali: 'theme-cream',
  sauna: 'theme-night',
  pelitila: 'theme-coal',
};

const lowestExample = Math.min(...rentalExample.tiers.flatMap((t) => (t.priceInclVat === null ? [] : [t.priceInclVat])));

export default function Venue() {
  const [viewer, setViewer] = useState<{ space: Space['id']; index: number } | null>(null);
  const viewerSpace = spaces.find((s) => s.id === viewer?.space);

  return (
    <>
      <PageHero
        eyebrow="Juhlatilat · Joensuu"
        title={
          <>
            Kaksi kerrosta, <em>yksi seurue.</em>
          </>
        }
        lede="Tilaisuus on aina yksityinen. Alakerrassa ruokailu- ja seurustelutilat sekä saunaosasto, yläkerrassa pelitila – noin 10–50 hengen juhliin ja muihin yksityistilaisuuksiin."
        image={{ slug: 'sali-ilta-aurinko', alt: 'Juhlahumujen sali ilta-auringossa: avotakka, sohvaryhmä ja suuret ikkunat terassille', position: '55% 50%' }}
      >
        <nav aria-label="Tilat tällä sivulla">
          <ul className="flex flex-wrap gap-2">
            {spaces.map((space) => (
              <li key={space.id}>
                <a href={`#${space.id}`} className="chip !min-h-11 hover:!border-ember">
                  {space.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#varustelu" className="chip !min-h-11 hover:!border-ember">
                Varustelu
              </a>
            </li>
          </ul>
        </nav>
      </PageHero>

      {/* The house at a glance */}
      <section className="theme-paper grain relative overflow-clip" aria-labelledby="overview-title">
        <div className="shell section relative z-10 grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow" data-reveal="up">
              Talo lyhyesti
            </p>
            <h2 id="overview-title" className="display-md mt-6 max-w-[18ch]" data-reveal="up" data-reveal-delay="0.05">
              Juhlat, sauna ja pelit <em>saman katon alla.</em>
            </h2>
            <p className="mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-ash" data-reveal="up" data-reveal-delay="0.1">
              Tilaisuus on aina yksityinen, joten omat juomat ovat sallittuja. Talon laadukkaan äänentoistojärjestelmän voi yhdistää esimerkiksi
              Spotifyhin, ja pihassa on 20 parkkipaikkaa.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
              {venueFacts.map((fact, index) => (
                <div key={fact.label} className="border-t border-(--line-strong) pt-4" data-reveal="up" data-reveal-delay={String(0.05 * index)}>
                  <dd className="numeral text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)] leading-none">{fact.value}</dd>
                  <dt className="mt-2 text-[0.9rem] text-ash">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Floor diagram */}
          <div className="lg:col-span-6" data-reveal="up" data-reveal-delay="0.1">
            <figure aria-labelledby="floors-caption" className="relative">
              <div className="space-y-3">
                <a
                  href="#pelitila"
                  className="group relative block overflow-hidden rounded-lg bg-ink p-6 text-cream transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-8"
                >
                  <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ember">Yläkerta</span>
                  <span className="mt-3 block font-display text-[1.9rem] leading-none tracking-tight sm:text-[2.3rem]">Pelitila</span>
                  <span className="mt-3 block text-[0.88rem] text-smoke">Biljardi · ilmakiekko · voima- ja nopeuspelit · flipperi · darts · pelikonsoli</span>
                  <ArrowUpRight aria-hidden="true" className="absolute right-6 top-6 size-5 text-smoke transition-colors group-hover:text-ember" />
                </a>
                <div className="grid grid-cols-[1.35fr_1fr] gap-3">
                  <a
                    href="#sali"
                    className="group relative block rounded-lg bg-[#fbf6ee] p-6 ring-1 ring-ink/10 transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-8"
                  >
                    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-rust">Alakerta</span>
                    <span className="mt-3 block font-display text-[1.6rem] leading-none tracking-tight sm:text-[2rem]">Sali ja ruokailu</span>
                    <span className="mt-3 block text-[0.88rem] text-ash">Avotakka · tarjoilulinjasto · sohvaryhmät</span>
                  </a>
                  <a
                    href="#sauna"
                    className="group relative block rounded-lg bg-[#fbf6ee] p-6 ring-1 ring-ink/10 transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-8"
                  >
                    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-rust">Alakerta</span>
                    <span className="mt-3 block font-display text-[1.6rem] leading-none tracking-tight sm:text-[2rem]">Sauna</span>
                    <span className="mt-3 block text-[0.88rem] text-ash">Pukuhuone · terassi</span>
                  </a>
                </div>
                <div className="flex items-center gap-3 px-1 pt-1 text-[0.8rem] text-ash">
                  <span className="h-px flex-1 bg-(--line-strong)" aria-hidden="true" />
                  Ulkoterassi · lisäpalveluna kylpytynnyri
                  <span className="h-px flex-1 bg-(--line-strong)" aria-hidden="true" />
                </div>
              </div>
              <figcaption id="floors-caption" className="sr-only">
                Kaavio tilojen sijoittumisesta: yläkerrassa pelitila, alakerrassa sali ja ruokailutilat sekä saunaosasto, josta käynti ulkoterassille.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {spaces.map((space, spaceIndex) => {
        const [main, ...rest] = space.photos;
        const flip = spaceIndex % 2 === 1;
        return (
          <section key={space.id} id={space.id} className={cx(themes[space.id], 'grain relative scroll-mt-(--header-h) overflow-clip')} aria-labelledby={`${space.id}-title`}>
            <div className="shell section relative z-10">
              <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
                <div className={cx('lg:col-span-5', flip ? 'lg:order-2 lg:col-start-8' : '')}>
                  <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
                    <p className="eyebrow" data-reveal="up">
                      {space.floor} · {space.name}
                    </p>
                    <h2 id={`${space.id}-title`} className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
                      {space.headline}
                    </h2>
                    <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-(--muted)" data-reveal="up" data-reveal-delay="0.1">
                      {space.body.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </div>
                    <ul className="mt-8 grid gap-x-6 sm:grid-cols-2" data-reveal="up" data-reveal-delay="0.15">
                      {space.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 border-t border-(--line) py-3 text-[0.95rem]">
                          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-(--accent)" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={cx('lg:col-span-7', flip ? 'lg:order-1' : 'lg:col-start-6')}>
                  {main && (
                    <PhotoButton
                      photo={main}
                      onOpen={() => setViewer({ space: space.id, index: 0 })}
                      frameAspect={4 / 3}
                      className={cx('aspect-[4/3] sm:aspect-[3/2]', flip ? 'rounded-tr-[clamp(3rem,9vw,8rem)]' : 'rounded-tl-[clamp(3rem,9vw,8rem)]')}
                      sizes="(min-width: 1024px) 55vw, 100vw"
                    />
                  )}
                  {rest.length > 0 && (
                    <div className={cx('mt-4 grid gap-4', rest.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3')}>
                      {rest.map((photo, i) => (
                        <PhotoButton
                          key={photo.slug}
                          photo={photo}
                          onOpen={() => setViewer({ space: space.id, index: i + 1 })}
                          frameAspect={0.8}
                          className={cx('aspect-[4/5]', rest.length === 3 && i === 2 && 'max-sm:col-span-2 max-sm:aspect-[3/2]')}
                          sizes="(min-width: 1024px) 18vw, 45vw"
                          delay={0.08 * (i + 1)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Amenities */}
      <section id="varustelu" className="theme-paper grain relative scroll-mt-(--header-h) overflow-clip" aria-labelledby="amenities-title">
        <div className="shell section relative z-10">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow" data-reveal="up">
                Varustelu ja palvelut
              </p>
              <h2 id="amenities-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
                Kaikki valmiina, <em>kun saavutte.</em>
              </h2>
            </div>
            <p className="lede lg:col-span-5 lg:pb-2" data-reveal="up" data-reveal-delay="0.1">
              Tilavuokraan kuuluu paljon sellaista, mitä juhliin muuten joutuisi kantamaan itse. Tarkka sisältö on listattu hinnastossa.
            </p>
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-(--line) bg-(--line) sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {amenities.map((amenity, index) => (
              <li key={amenity.id} className="bg-(--bg) p-6 sm:p-7" data-reveal="fade" data-reveal-delay={String((index % 4) * 0.05)}>
                <AmenityIcon name={amenity.icon} className="size-7 text-rust" />
                <h3 className="mt-5 font-display text-[1.3rem] leading-tight tracking-tight">{amenity.label}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ash">{amenity.detail}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
            <Link
              to={pages.pricing.path}
              className="group flex flex-col justify-between gap-8 rounded-2xl bg-ink p-8 text-cream transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-10"
              data-reveal="up"
            >
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ember">Hinnasto</span>
              <span>
                <span className="block font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-tight tracking-tight">
                  Tilavuokran esimerkkihinnat alkaen {formatEuro(lowestExample)}
                </span>
                <span className="mt-3 block text-[0.9rem] leading-relaxed text-smoke">{rentalExample.conditions}</span>
              </span>
              <span className="link-line w-fit text-[0.95rem]">
                Katso hinnasto
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
            <Link
              to={pages.meetings.path}
              className="group flex flex-col justify-between gap-8 rounded-2xl bg-[#fbf6ee] p-8 ring-1 ring-ink/10 transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-10"
              data-reveal="up"
              data-reveal-delay="0.08"
            >
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-rust">Kokoukset</span>
              <span>
                <span className="block font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-tight tracking-tight">
                  Arkisin myös kokouskäyttöön noin 20 hengelle
                </span>
                <span className="mt-3 block text-[0.9rem] leading-relaxed text-ash">Videotykki, 75″ televisio, äänentoisto ja langaton verkko.</span>
              </span>
              <span className="link-line w-fit text-[0.95rem]">
                Kokoustilat
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        items={viewerSpace?.photos.map((p) => ({ slug: p.slug, alt: p.alt, caption: p.caption })) ?? []}
        index={viewer?.index ?? null}
        onIndexChange={(index) => setViewer((v) => (v ? { ...v, index } : v))}
        onClose={() => setViewer(null)}
        label={viewerSpace ? `Kuvat: ${viewerSpace.name}` : undefined}
      />

      <CtaBand />
    </>
  );
}

function PhotoButton({
  photo,
  onOpen,
  className,
  sizes,
  delay = 0,
  frameAspect,
}: {
  photo: Space['photos'][number];
  onOpen: () => void;
  className?: string;
  sizes: string;
  delay?: number;
  frameAspect?: number;
}) {
  return (
    <div className={cx('frame', className)} data-reveal="mask" data-reveal-delay={String(delay)}>
      <button type="button" onClick={onOpen} className="group absolute inset-0 block size-full" aria-label={`Avaa kuva suurena: ${photo.caption ?? photo.alt}`}>
        <Picture
          slug={photo.slug}
          alt={photo.alt}
          sizes={sizes}
          frameAspect={frameAspect}
          position={photo.position}
          className="block size-full"
          imgClassName="size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
        />
        {photo.caption && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-night/80 to-transparent p-4 pt-12 text-left text-cream">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">{photo.caption}</span>
            <Expand aria-hidden="true" className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
        )}
      </button>
    </div>
  );
}
