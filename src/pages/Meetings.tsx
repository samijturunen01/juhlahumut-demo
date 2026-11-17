import { Link } from 'react-router';
import { ArrowRight, Coffee, MonitorPlay, Projector, Speaker, Wifi } from 'lucide-react';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { pages } from '@/data/site';
import { meetings } from '@/data/venue';

const equipmentIcons = [Projector, MonitorPlay, Speaker, Wifi];

export default function Meetings() {
  return (
    <>
      <PageHero
        eyebrow="Kokoukset · arkisin"
        title={
          <>
            Kokous, jonka jälkeen <em>on hyvä jatkaa.</em>
          </>
        }
        lede={meetings.intro}
        image={{ slug: 'sali-sohvat-takka', alt: 'Sohvaryhmä ja pöytä avotakan äärellä Juhlahumujen salissa', position: '45% 50%' }}
      >
        <Link to={`${pages.quote.path}?tilaisuus=kokoukset`} className="btn">
          Kysy tarjous kokouksesta
          <ArrowRight aria-hidden="true" />
        </Link>
      </PageHero>

      <section className="theme-cream grain relative overflow-clip" aria-labelledby="meeting-title">
        <div className="shell section relative z-10">
          <div className="grid gap-x-14 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow" data-reveal="up">
                Kokoustila Joensuussa
              </p>
              <h2 id="meeting-title" className="display-md mt-6" data-reveal="up" data-reveal-delay="0.05">
                Tekniikka valmiina, <em>takka lämpimänä.</em>
              </h2>
              <dl className="mt-10 grid grid-cols-2 gap-x-8">
                <div className="border-t border-(--line-strong) pt-4" data-reveal="up">
                  <dd className="numeral text-[clamp(2.4rem,1.8rem+2.4vw,3.8rem)] leading-none">~20</dd>
                  <dt className="mt-2 text-[0.9rem] text-ash">{meetings.capacity.toLowerCase()}</dt>
                </div>
                <div className="border-t border-(--line-strong) pt-4" data-reveal="up" data-reveal-delay="0.05">
                  <dd className="font-display text-[clamp(1.8rem,1.4rem+1.6vw,2.8rem)] leading-none tracking-tight">{meetings.availability}</dd>
                  <dt className="mt-2 text-[0.9rem] text-ash">vuokrattavissa</dt>
                </div>
              </dl>

              <div className="mt-10 flex items-start gap-4 rounded-2xl bg-ink p-6 text-cream sm:p-8" data-reveal="up" data-reveal-delay="0.1">
                <Coffee aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-ember" strokeWidth={1.5} />
                <p className="text-[1rem] leading-relaxed">{meetings.catering}</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid gap-px overflow-hidden rounded-2xl border border-(--line) bg-(--line) sm:grid-cols-2">
                {meetings.equipment.map((item, index) => {
                  const Icon = equipmentIcons[index] ?? Projector;
                  return (
                    <li key={item.label} className="bg-(--bg) p-7 sm:p-9" data-reveal="fade" data-reveal-delay={String(index * 0.05)}>
                      <Icon aria-hidden="true" className="size-7 text-rust" strokeWidth={1.4} />
                      <h3 className="mt-6 font-display text-[1.5rem] leading-tight tracking-tight">{item.label}</h3>
                      <p className="mt-2 text-[0.92rem] text-ash">{item.detail}</p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="frame aspect-[4/3]" data-reveal="mask">
                  <Picture slug="sali-takka-portaat" alt="Sali, jossa avotakka ja tarjoilulinjasto" sizes="(min-width: 1024px) 28vw, 50vw" />
                </div>
                <div className="frame aspect-[4/3]" data-reveal="mask" data-reveal-delay="0.08">
                  <Picture slug="sininen-sali" alt="Ruokailutila, jossa pyöreät pöydät" sizes="(min-width: 1024px) 28vw, 50vw" />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-16 max-w-2xl text-[0.95rem] leading-relaxed text-ash" data-reveal="up">
            Kokouksen jälkeen ilta voi jatkua saunan ja pelien parissa – kerro toiveistasi tarjouspyynnössä, niin kokonaisuus hinnoitellaan kerralla.{' '}
            <Link to={pages.venue.path} className="prose-link text-ink">
              Tutustu tiloihin
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Varaa kokous <em>arkipäivälle.</em>
          </>
        }
        text="Kerro päivä, osallistujamäärä ja toiveet kahvituksesta tai lounaasta – saat tarjouksen kokonaisuudesta."
        query="?tilaisuus=kokoukset"
      />
    </>
  );
}
