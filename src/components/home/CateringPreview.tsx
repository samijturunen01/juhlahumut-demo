import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { cateringNotes, dessertExamples, getMenu, menuPriceRange, menus } from '@/data/menus';
import { pages } from '@/data/site';

/**
 * Selected dishes, pulled from the real menus by reference (menu id + position),
 * so this preview can never drift from the menu data.
 */
const picks: { menuId: string; group: number; item: number }[] = [
  { menuId: 'menu-4', group: 2, item: 0 },
  { menuId: 'menu-2', group: 1, item: 0 },
  { menuId: 'menu-1', group: 1, item: 0 },
  { menuId: 'pikkujoulumenu-2', group: 1, item: 0 },
];

export function CateringPreview() {
  const dishes = picks.flatMap((pick) => {
    const menu = getMenu(pick.menuId);
    const dish = menu?.groups[pick.group]?.[pick.item];
    return menu && dish ? [{ dish: dish.name, menu: menu.name, price: menu.pricePerPerson }] : [];
  });

  return (
    <section className="theme-paper grain relative overflow-clip" aria-labelledby="catering-title">
      <div className="shell section relative z-10 grid gap-x-12 gap-y-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="eyebrow" data-reveal="up">
            Catering
          </p>
          <h2 id="catering-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
            Pöytä katetaan <em>puolestanne.</em>
          </h2>
          <p className="lede mt-7 max-w-[34rem]" data-reveal="up" data-reveal-delay="0.1">
            {cateringNotes.intro}
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-8" data-reveal="up" data-reveal-delay="0.15">
            <div className="border-t border-(--line-strong) pt-4">
              <dd className="numeral text-5xl leading-none">{menus.length}</dd>
              <dt className="mt-2 text-[0.9rem] text-ash">valmista menua</dt>
            </div>
            <div className="border-t border-(--line-strong) pt-4">
              <dd className="numeral text-5xl leading-none">
                {menuPriceRange.min}–{menuPriceRange.max} <span className="text-3xl text-ash">€</span>
              </dd>
              <dt className="mt-2 text-[0.9rem] text-ash">henkilöä kohden</dt>
            </div>
          </dl>

          <p className="mt-8 max-w-md text-[0.92rem] leading-relaxed text-ash" data-reveal="up" data-reveal-delay="0.2">
            {cateringNotes.dietary}
          </p>

          <Link to={pages.catering.path} className="btn btn--dark mt-9" data-reveal="up" data-reveal-delay="0.25">
            Tutustu menuihin
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        {/* A printed menu card instead of food photography – the current site has none, and none is invented */}
        <div className="lg:col-span-6 lg:pl-8">
          <div className="relative mx-auto max-w-[34rem]" data-reveal="up" data-reveal-delay="0.1">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-sm bg-sand/70" aria-hidden="true" />
            <article className="relative -rotate-1 rounded-sm bg-[#fbf6ee] px-7 py-10 shadow-xl shadow-ink/10 ring-1 ring-ink/10 sm:px-12 sm:py-14">
              <div className="pointer-events-none absolute inset-3 rounded-[2px] border border-ink/15" aria-hidden="true" />
              <header className="text-center">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rust">Juhlahumut · Catering</p>
                <h3 className="mt-4 font-display text-[2rem] font-light italic leading-none tracking-tight sm:text-[2.4rem]">Poimintoja menuilta</h3>
              </header>

              <ul className="mt-9">
                {dishes.map((d) => (
                  <li key={d.dish} className="border-t border-ink/10 py-5 text-center first:border-t-0 first:pt-0">
                    <p className="font-display text-[1.18rem] leading-snug tracking-tight sm:text-[1.3rem]">{d.dish}</p>
                    <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash">
                      {d.menu} <span className="mx-1 text-rust">·</span> <span className="tabular">{d.price} € / hlö</span>
                    </p>
                  </li>
                ))}
                <li className="border-t border-ink/10 pt-5 text-center">
                  <p className="font-display text-[1.18rem] leading-snug tracking-tight sm:text-[1.3rem]">{dessertExamples[0]}</p>
                  <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash">
                    Jälkiruoka <span className="mx-1 text-rust">·</span> sopimuksen mukaan
                  </p>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
