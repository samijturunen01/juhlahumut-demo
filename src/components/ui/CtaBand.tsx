import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Phone } from 'lucide-react';
import { company } from '@/data/company';
import { pages } from '@/data/site';

interface CtaBandProps {
  title?: ReactNode;
  text?: string;
  /** Query string appended to the quote link, e.g. "?tilaisuus=kokoukset". */
  query?: string;
}

/** Closing call to action used at the end of every sub-page. */
export function CtaBand({
  title = (
    <>
      Kerro, mitä juhlitaan – <em>me kerromme hinnan.</em>
    </>
  ),
  text = 'Tarjouspyyntö ei sido mihinkään. Kerro toivomasi päivä ja seurueen koko, niin saat tarjouksen juuri teidän tilaisuuteenne.',
  query = '',
}: CtaBandProps) {
  return (
    <section className="theme-night grain relative isolate overflow-clip" aria-labelledby="cta-band-title">
      <div className="disc-glow left-1/2 top-1/2 -z-10 h-[46vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 opacity-60 lg:h-[26vw] lg:w-[78vw]" aria-hidden="true" />
      <div className="shell section relative z-10 text-center">
        <h2 id="cta-band-title" className="display-lg mx-auto max-w-[18ch]" data-reveal="up">
          {title}
        </h2>
        <p className="lede mx-auto mt-7 max-w-xl" data-reveal="up" data-reveal-delay="0.08">
          {text}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" data-reveal="up" data-reveal-delay="0.16">
          <Link to={`${pages.quote.path}${query}`} className="btn w-full sm:w-auto">
            Pyydä tarjous
            <ArrowRight aria-hidden="true" />
          </Link>
          <a href={company.phone.href} className="btn btn--ghost w-full sm:w-auto">
            <Phone aria-hidden="true" />
            <span className="tabular">Soita {company.phone.display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
