import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, CalendarHeart, Car, MapPin, Navigation, Phone } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { company } from '@/data/company';
import { pages } from '@/data/site';

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Yhteystiedot"
        title={
          <>
            Tervetuloa <em>Aspitielle.</em>
          </>
        }
        lede="Soita ja kysy vapaista päivistä, tai lähetä tarjouspyyntö – kerro toivottu päivä ja seurueen koko, niin saat tarjouksen juuri teidän tilaisuuteenne."
      />

      <section className="theme-night grain relative overflow-clip" aria-labelledby="contact-title">
        <h2 id="contact-title" className="sr-only">
          Ota yhteyttä
        </h2>
        <div className="shell relative z-10 pb-[var(--section-y)]">
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Phone – the primary channel on the current site */}
            <a
              href={company.phone.href}
              className="group relative flex flex-col justify-between gap-10 overflow-hidden rounded-2xl bg-ember p-7 text-night transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-10 lg:col-span-7 lg:min-h-[22rem]"
              data-reveal="up"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em]">Soita ja varaa</span>
                <span className="grid size-12 place-items-center rounded-full bg-night text-ember transition-transform duration-500 ease-out-expo group-hover:rotate-12">
                  <Phone aria-hidden="true" className="size-5" />
                </span>
              </span>
              <span>
                <span className="numeral block text-[clamp(2.8rem,1.4rem+6vw,6.5rem)] leading-[0.95] tracking-[-0.04em]">{company.phone.display}</span>
                <span className="mt-4 block max-w-sm text-[0.98rem] leading-relaxed text-night/75">
                  Nopein tapa kysyä vapaita päiviä ja sopia juhlien yksityiskohdista.
                </span>
              </span>
            </a>

            {/* Address */}
            <div className="flex flex-col justify-between gap-10 rounded-2xl border border-cream/15 p-7 sm:p-10 lg:col-span-5" data-reveal="up" data-reveal-delay="0.06">
              <span className="flex items-center justify-between gap-4">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-smoke">Osoite</span>
                <MapPin aria-hidden="true" className="size-5 text-ember" />
              </span>
              <address className="not-italic">
                <span className="block font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] leading-none tracking-tight">{company.address.street}</span>
                <span className="mt-2 block font-display text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] italic text-cream/80">{company.address.city}</span>
              </address>
              <div className="flex flex-wrap gap-3">
                <a href={company.mapUrl} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                  <MapPin aria-hidden="true" />
                  Avaa kartalla
                  <span className="sr-only"> (Google Maps, avautuu uuteen välilehteen)</span>
                </a>
                <a href={company.directionsUrl} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                  <Navigation aria-hidden="true" />
                  Reittiohjeet
                  <span className="sr-only"> (Google Maps, avautuu uuteen välilehteen)</span>
                </a>
              </div>
            </div>

            {/* Quote */}
            <Link
              to={pages.quote.path}
              className="group flex flex-col justify-between gap-8 rounded-2xl bg-cream p-7 text-ink transition-transform duration-500 ease-out-expo hover:-translate-y-1 sm:p-10 lg:col-span-5"
              data-reveal="up"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-rust">Kirjallisesti</span>
                <CalendarHeart aria-hidden="true" className="size-5 text-rust" />
              </span>
              <span>
                <span className="block font-display text-[clamp(1.8rem,1.3rem+1.8vw,2.8rem)] leading-tight tracking-tight">Pyydä tarjous lomakkeella</span>
                <span className="mt-3 block max-w-sm text-[0.95rem] leading-relaxed text-ash">
                  Valitse toivepäivä kalenterista ja kerro tilaisuudestasi. Saatavuus ja hinta vahvistetaan tarjouksessa.
                </span>
              </span>
              <span className="link-line w-fit text-[0.95rem]">
                Siirry lomakkeelle
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>

            {/* Photo + arrival */}
            <div className="relative overflow-hidden rounded-2xl lg:col-span-7" data-reveal="mask">
              <Picture
                slug="sali-ilta-aurinko"
                alt="Juhlahumujen sali ilta-auringossa, ikkunoista näkyy terassi"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="absolute inset-0 block size-full"
                imgClassName="size-full object-cover"
                position="60% 50%"
              />
              <div className="absolute inset-0 bg-night/35" aria-hidden="true" />
              <div className="absolute inset-0 bg-linear-to-t from-night via-night/75 to-night/10" aria-hidden="true" />
              <div className="relative flex min-h-[20rem] flex-col justify-end gap-5 p-7 sm:p-10">
                <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cream/85">
                  <Car aria-hidden="true" className="size-4 text-ember" />
                  Saapuminen
                </p>
                <p className="max-w-md font-display text-[clamp(1.4rem,1.1rem+1.1vw,2rem)] leading-snug tracking-tight">
                  {company.locationNote} Pihassa on {company.parkingSpaces} parkkipaikkaa.
                </p>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="mt-16 grid gap-x-12 gap-y-10 border-t border-cream/10 pt-12 md:grid-cols-3">
            <div data-reveal="up">
              <h3 className="eyebrow eyebrow--plain">Yritys</h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-cream/85">
                {company.name}
                <br />
                {company.descriptor}
              </p>
            </div>
            <div data-reveal="up" data-reveal-delay="0.05">
              <h3 className="eyebrow eyebrow--plain">Tilat käytössä</h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-cream/85">
                Varauksesta – tilaisuus on aina yksityinen. Arkisin tilat vuokrataan myös kokouskäyttöön.
              </p>
            </div>
            <div data-reveal="up" data-reveal-delay="0.1">
              <h3 className="eyebrow eyebrow--plain">Seuraa</h3>
              <ul className="mt-4 space-y-2">
                {company.social.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[1rem] text-cream/85 transition-colors hover:text-ember">
                      {s.label} <span className="text-smoke">{s.handle}</span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={company.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[1rem] text-cream/85 transition-colors hover:text-ember">
                    Esittelyvideo <span className="text-smoke">YouTube</span>
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
