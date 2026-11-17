import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { LogoFull } from '@brand-art';
import { company, demoNotice } from '@/data/company';
import { mainNav, pages } from '@/data/site';

export function Footer() {
  const links = [...mainNav, pages.meetings, pages.quote];
  return (
    <footer id="site-footer" className="theme-night grain relative overflow-clip border-t border-cream/10">
      <div className="shell relative z-10 pb-10 pt-16 lg:pt-24">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" aria-label="Juhlahumut – etusivulle" className="inline-block rounded-sm">
              <LogoFull id="footer-logo" decorative className="h-auto w-56 lg:w-72" />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-smoke">
              Yksityinen juhlatila, saunatila ja catering {company.capacity.min}–{company.capacity.max} hengen tilaisuuksiin Joensuussa.
            </p>
          </div>

          <nav aria-label="Alavalikko" className="md:col-span-3">
            <h2 className="eyebrow eyebrow--plain mb-5">Sivut</h2>
            <ul className="space-y-2.5">
              {links.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-[0.98rem] text-cream/85 transition-colors hover:text-ember">
                    {item.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="eyebrow eyebrow--plain mb-5">Yhteystiedot</h2>
            <address className="space-y-2.5 text-[0.98rem] not-italic text-cream/85">
              <p>
                {company.name}
                <br />
                {company.address.street}, {company.address.city}
              </p>
              <p>
                <a href={company.phone.href} className="tabular transition-colors hover:text-ember">
                  {company.phone.display}
                </a>
              </p>
              <p>
                <a href={company.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-ember">
                  Avaa kartalla
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </p>
            </address>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
              {company.social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-cream/85 transition-colors hover:text-ember">
                    {s.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={company.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-cream/85 transition-colors hover:text-ember">
                  Esittelyvideo
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  <span className="sr-only"> (YouTube, avautuu uuteen välilehteen)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-6 text-[0.82rem] leading-relaxed text-smoke md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">
            <strong className="font-semibold text-cream">{demoNotice.short}.</strong> {demoNotice.long}
          </p>
          <p className="shrink-0">
            Virallinen sivusto:{' '}
            <a href={company.officialSiteUrl} className="prose-link text-cream" rel="noreferrer">
              juhlahumut.fi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
