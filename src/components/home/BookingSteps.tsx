import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { pages } from '@/data/site';

export const bookingSteps = [
  {
    title: 'Valitse ajankohta',
    text: 'Katso kalenterista teille sopiva päivä. Se on toive, ei vielä varaus – saatavuus vahvistetaan erikseen.',
  },
  {
    title: 'Kerro tilaisuudestasi',
    text: 'Henkilömäärä, tilaisuuden luonne ja toiveet saunan, pelien ja cateringin suhteen.',
  },
  {
    title: 'Pyydä tarjous',
    text: 'Lähetä tarjouspyyntö tai soita. Saatte hinnan juuri teidän seurueenne ja ajankohtanne mukaan.',
  },
  {
    title: 'Sovi yksityiskohdista',
    text: 'Varaus vahvistuu vasta, kun päivä ja yksityiskohdat on sovittu Juhlahumujen kanssa.',
  },
];

export function BookingSteps() {
  return (
    <section className="theme-cream grain relative overflow-clip" aria-labelledby="steps-title">
      <div className="shell section relative z-10">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal="up">
              Näin se etenee
            </p>
            <h2 id="steps-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
              Toiveesta juhliin <em>neljällä askeleella.</em>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2" data-reveal="up" data-reveal-delay="0.1">
            <Link to={pages.quote.path} className="btn btn--dark">
              Aloita tarjouspyyntö
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ol className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {bookingSteps.map((step, index) => (
            <li key={step.title} className="relative pb-10 lg:pb-0">
              <div className="rule" data-reveal="rule" data-reveal-delay={String(index * 0.1)} />
              <div className="pt-6" data-reveal="up" data-reveal-delay={String(0.1 + index * 0.1)}>
                <span className="numeral block text-[clamp(3.5rem,2.4rem+3.4vw,5.5rem)] leading-none text-rust" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="display-sm mt-5">
                  <span className="sr-only">{index + 1}. </span>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[28ch] text-[0.98rem] leading-relaxed text-ash">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-2xl border-l-2 border-rust/60 pl-4 text-[0.88rem] leading-relaxed text-ash lg:mt-16" data-reveal="up">
          Kuvaus on suuntaa-antava. Tarkka varauskäytäntö sovitaan aina Juhlahumujen kanssa – tarjouspyynnön lähettäminen ei vielä vahvista varausta.
        </p>
      </div>
    </section>
  );
}
