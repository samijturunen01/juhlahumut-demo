import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { company } from '@/data/company';
import { pages } from '@/data/site';

/**
 * Closing section. The photograph sits inside a large tilted ellipse – the same
 * disc, at the same angle, as in the logo – with the headline crossing it.
 */
export function FinalCta() {
  return (
    <section className="theme-night grain relative isolate overflow-clip" aria-labelledby="final-title">
      <div className="shell relative z-10 flex min-h-[88svh] flex-col items-center justify-center py-28 text-center lg:min-h-svh">
        {/* The disc */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-[3/1.02] w-[165vw] -translate-x-1/2 -translate-y-1/2 sm:w-[130vw] lg:w-[min(92vw,96rem)]"
          aria-hidden="true"
        >
          <div className="absolute -inset-[6%] rotate-(--disc-tilt) rounded-[50%] bg-ember/35 blur-3xl" />
          <div className="absolute inset-0 rotate-(--disc-tilt) overflow-hidden rounded-[50%] ring-1 ring-cream/25" data-reveal="fade">
            <div className="absolute -inset-y-[75%] inset-x-0 [rotate:23.65deg]">
              <Picture
                slug="sininen-sali"
                alt=""
                sizes="100vw"
                className="block size-full"
                imgClassName="size-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-night/55" />
          </div>
        </div>

        <p className="eyebrow eyebrow--plain" data-reveal="up">
          Pyydä tarjous
        </p>
        <h2 id="final-title" className="display-xl mt-7 max-w-[13ch]" data-reveal="up" data-reveal-delay="0.06">
          Seuraavat ikimuistoiset juhlat <em>alkavat tästä.</em>
        </h2>
        <p className="lede mx-auto mt-8 max-w-lg text-cream/85" data-reveal="up" data-reveal-delay="0.12">
          Kerro toivomasi päivä ja seurueen koko. Tarjouspyyntö ei sido mihinkään.
        </p>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row" data-reveal="up" data-reveal-delay="0.18">
          <Link to={pages.quote.path} className="btn w-full sm:w-auto">
            Pyydä tarjous
            <ArrowRight aria-hidden="true" />
          </Link>
          <a href={company.phone.href} className="btn btn--ghost w-full bg-night/40 sm:w-auto">
            <Phone aria-hidden="true" />
            <span className="tabular">{company.phone.display}</span>
          </a>
        </div>

        <address className="mt-14 flex flex-col items-center gap-x-8 gap-y-2 text-[0.92rem] not-italic text-cream/80 sm:flex-row" data-reveal="up" data-reveal-delay="0.24">
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 text-ember" />
            {company.name}, {company.address.street}, {company.address.city}
          </span>
          <a href={company.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline decoration-ember underline-offset-4">
            Avaa kartalla
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </address>
      </div>
    </section>
  );
}
