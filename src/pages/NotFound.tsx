import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { mainNav, pages } from '@/data/site';

/** Branded 404: a neon sign with one tube that flickers once, then holds. */
export default function NotFound() {
  return (
    <section className="theme-night grain relative isolate flex min-h-svh items-center overflow-clip" aria-labelledby="nf-title">
      <div className="disc-glow left-1/2 top-1/2 -z-10 h-[50vw] w-[130vw] -translate-x-1/2 -translate-y-1/2 opacity-50 lg:h-[28vw] lg:w-[80vw]" aria-hidden="true" />
      <div className="shell relative z-10 pb-20 pt-[calc(var(--header-h)+4rem)] text-center">
        <p className="neon-404 neon-text font-display text-[clamp(7rem,4rem+18vw,17rem)] font-light italic leading-none tracking-[-0.05em]" aria-hidden="true">
          4<span className="neon-404__flicker">0</span>4
        </p>
        <h1 id="nf-title" className="display-md mx-auto mt-8 max-w-[20ch]">
          Tämä ovi ei vie <em>juhliin.</em>
        </h1>
        <p className="lede mx-auto mt-6 max-w-lg">
          Etsimääsi sivua ei löytynyt – se on ehkä siirtynyt tai osoitteessa on kirjoitusvirhe. Juhlat jatkuvat alla olevista linkeistä.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={pages.home.path} className="btn w-full sm:w-auto">
            Etusivulle
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link to={pages.quote.path} className="btn btn--ghost w-full sm:w-auto">
            Pyydä tarjous
          </Link>
        </div>
        <nav aria-label="Sivuston sivut" className="mt-14">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.95rem] text-smoke">
            {mainNav.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="transition-colors hover:text-ember">
                  {item.nav}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
