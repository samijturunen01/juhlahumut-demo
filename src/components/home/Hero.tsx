import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { LogoFull } from '@brand-art';
import { Picture } from '@/components/ui/Picture';
import { company } from '@/data/company';
import { pages } from '@/data/site';
import { useHeroIntro } from './useHeroIntro';

const facts = [
  { value: `${company.capacity.min}–${company.capacity.max}`, label: 'hengen yksityistilaisuudet' },
  { value: '2', label: 'kerrosta vain teidän käytössänne' },
  { value: 'Sauna', label: 'sisältyy tilavuokraan' },
  { value: 'Omat juomat', label: 'ovat sallittuja' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroIntro(root);

  return (
    <section ref={root} className="theme-night grain relative isolate flex min-h-svh flex-col overflow-clip" aria-labelledby="hero-title">
      <div className="disc-glow -right-[30vw] top-[8%] -z-10 h-[62vw] w-[150vw] opacity-80 lg:-right-[12vw] lg:top-[16%] lg:h-[30vw] lg:w-[82vw]" aria-hidden="true" />

      <div className="shell relative z-10 grid flex-1 grid-cols-1 gap-x-8 pt-[calc(var(--header-h)+0.5rem)] lg:grid-cols-12 lg:pt-[calc(var(--header-h)+1rem)]">
        {/* The venue itself – never a stock picture */}
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <div className="frame h-[52svh] min-h-[19rem] rounded-tl-[4.5rem] sm:rounded-tl-[7rem] lg:h-full lg:min-h-[32rem] lg:rounded-tl-[12rem]">
            <Picture
              slug="hero-sali"
              alt="Juhlahumujen sali ilta-auringossa: avotakka, sohvaryhmä ja suuret ikkunat terassille"
              sizes="(min-width: 1024px) 58vw, 100vw"
              position="30% 50%"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-night via-night/20 to-transparent lg:bg-linear-to-r lg:from-night/85 lg:via-night/20 lg:to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 bg-linear-to-t from-night/60 to-transparent to-40% max-lg:hidden" aria-hidden="true" />
            <div data-intro="dim" className="hero-dim" aria-hidden="true" />
          </div>

          <figure data-intro="aside" className="absolute bottom-6 right-4 hidden w-36 sm:block lg:bottom-10 lg:right-8 lg:w-44 xl:w-52">
            <div className="frame aspect-[4/5] rounded-md shadow-2xl shadow-black/70 ring-4 ring-night">
              <Picture slug="sauna" alt="Tunnelmavalaistu sauna" sizes="208px" position="50% 60%" priority />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night/90 to-transparent px-3 pb-2.5 pt-8 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream/90">
                Sauna
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Headline overlaps the photograph, like the logo's script crosses its disc */}
        <div data-intro="copy" className="relative z-10 -mt-20 pb-10 sm:-mt-24 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-end lg:pb-14">
          <p className="eyebrow">Yksityinen juhlatila · Joensuu</p>
          <h1 id="hero-title" className="display-xl mt-5 lg:mt-7">
            Juhlat, jotka <em className="lg:block">muistetaan.</em>
          </h1>
          <p className="lede mt-6 max-w-[33rem] text-cream/80 lg:mt-8">
            Sali ja avotakka, tunnelmallinen sauna, yläkerran pelitila ja catering – kaksi kerrosta vain teidän seurueellenne, {company.capacity.min}–
            {company.capacity.max} hengen juhliin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
            <Link to={pages.quote.path} className="btn">
              Pyydä tarjous
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link to={pages.venue.path} className="btn btn--ghost">
              Tutustu juhlatiloihin
            </Link>
          </div>
        </div>
      </div>

      <div className="shell relative z-10 pb-7 lg:pb-9">
        <ul data-intro="aside" className="grid grid-cols-2 gap-x-6 border-t border-cream/15 lg:grid-cols-4">
          {facts.map((fact) => (
            <li key={fact.label} className="flex flex-col gap-1 pt-4 max-lg:nth-[n+3]:mt-4 max-lg:nth-[n+3]:border-t max-lg:nth-[n+3]:border-cream/15 lg:flex-row lg:items-baseline lg:gap-3 lg:pt-5">
              <span className="numeral text-[1.35rem] leading-none text-cream lg:text-2xl">{fact.value}</span>
              <span className="text-[0.82rem] leading-snug text-smoke">{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Intro stage: the full logo, shown only while the intro plays */}
      <div data-intro="stage" className="hero-stage" aria-hidden="true">
        <div data-intro="glow" className="hero-stage__glow" />
        <LogoFull id="intro-logo" decorative className="relative block h-auto w-full" />
      </div>
    </section>
  );
}
