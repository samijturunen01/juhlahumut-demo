import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { pages } from '@/data/site';
import { venueFacts } from '@/data/venue';

export function Welcome() {
  return (
    <section className="theme-cream grain relative overflow-clip" aria-labelledby="welcome-title">
      <div className="shell section relative z-10">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:pr-6">
            <p className="eyebrow" data-reveal="up">
              Tervetuloa Juhlahumuihin
            </p>
            <h2 id="welcome-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
              Koko talo on <em>teidän.</em>
            </h2>
            <p className="display-sm mt-9 max-w-[27ch] text-ink/90 sm:max-w-[34ch]" data-reveal="up" data-reveal-delay="0.1">
              Kun varaatte Juhlahumut, saatte kaksi kerrosta vain omalle seurueellenne – ja illan, jonka tahdin päätätte itse.
            </p>
            <div className="mt-8 max-w-[34rem] space-y-4 text-[1.02rem] leading-relaxed text-ash" data-reveal="up" data-reveal-delay="0.15">
              <p>
                Alakerrassa ovat ruokailu- ja seurustelutilat sekä saunaosasto, yläkerrassa pelitila biljardeineen ja ilmakiekkoineen. Tilat sopivat noin
                10–50 hengen juhliin ja muihin yksityistilaisuuksiin.
              </p>
              <p>
                Tilaisuus on aina yksityinen, joten omat juomat ovat sallittuja. Ruokapuolesta huolehtii halutessanne talon oma catering – pikkupurtavasta
                juhlakattaukseen.
              </p>
            </div>
            <Link to={pages.venue.path} className="link-line mt-9" data-reveal="up" data-reveal-delay="0.2">
              Tutustu juhlatiloihin
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>

          <div className="relative lg:col-span-5">
            <div className="frame ml-auto aspect-[4/5] w-[86%] rounded-tr-[clamp(4rem,12vw,9rem)] lg:w-full" data-reveal="mask">
              <Picture
                slug="sali-sohvat-takka"
                alt="Sohvaryhmä ja pöytä avotakan äärellä ilta-auringossa"
                sizes="(min-width: 1024px) 38vw, 86vw"
                frameAspect={0.8}
                position="42% 50%"
              />
            </div>
            <div className="absolute -bottom-8 left-0 w-[46%] lg:-left-16 lg:w-[52%]" data-parallax="0.22">
              <div className="frame aspect-[4/3] shadow-2xl shadow-ink/25 ring-[6px] ring-cream" data-reveal="mask" data-reveal-delay="0.25">
                <Picture slug="sali-pyorea-poyta" alt="Pyöreä pöytä salin ikkunoiden edessä" sizes="(min-width: 1024px) 20vw, 46vw" frameAspect={4 / 3} />
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-x-8 lg:mt-32 lg:grid-cols-4">
          {venueFacts.map((fact, index) => (
            <div key={fact.label} className="max-lg:nth-[n+3]:mt-8">
              <div className="rule" data-reveal="rule" data-reveal-delay={String(index * 0.08)} />
              <div className="pt-5" data-reveal="up" data-reveal-delay={String(0.1 + index * 0.08)}>
                <dd className="numeral text-[clamp(2.6rem,1.4rem+4.6vw,5.25rem)] leading-none">{fact.value}</dd>
                <dt className="mt-3 text-[0.92rem] text-ash">{fact.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
