import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Flame, Leaf, Plus, Snowflake } from 'lucide-react';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { cateringNotes, dessertExamples, dietLegend, eveningSnackOptions, menuCategories, menuPriceRange, menus, type DietCode, type Menu } from '@/data/menus';
import { pages } from '@/data/site';
import { cx } from '@/lib/format';

type CategoryId = (typeof menuCategories)[number]['id'];

export default function Catering() {
  const [category, setCategory] = useState<CategoryId>('juhlamenu');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + menuCategories.length) % menuCategories.length;
    setCategory(menuCategories[next]!.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <PageHero
        eyebrow="Catering"
        title={
          <>
            Juhlapöytä, joka <em>katetaan puolestanne.</em>
          </>
        }
        lede={cateringNotes.intro}
        image={{ slug: 'sininen-sali', alt: 'Juhlahumujen ruokailutila: pyöreät pöydät ja riippuvalaisimet', position: '55% 50%' }}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#menut" className="btn">
            Selaa menuja
            <ArrowRight aria-hidden="true" />
          </a>
          <Link to={`${pages.quote.path}?catering=kylla`} className="btn btn--ghost">
            Pyydä tarjous
          </Link>
        </div>
      </PageHero>

      {/* At a glance */}
      <section className="theme-paper grain relative overflow-clip" aria-label="Catering lyhyesti">
        <div className="shell relative z-10 py-12 lg:py-16">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
            <div className="border-t border-(--line-strong) pt-4" data-reveal="up">
              <dd className="numeral text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)] leading-none">{menus.length}</dd>
              <dt className="mt-2 text-[0.9rem] text-ash">valmista menua</dt>
            </div>
            <div className="border-t border-(--line-strong) pt-4" data-reveal="up" data-reveal-delay="0.05">
              <dd className="numeral text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)] leading-none">
                {menuPriceRange.min}–{menuPriceRange.max} <span className="text-[0.6em] text-ash">€</span>
              </dd>
              <dt className="mt-2 text-[0.9rem] text-ash">henkilöä kohden</dt>
            </div>
            <div className="border-t border-(--line-strong) pt-4" data-reveal="up" data-reveal-delay="0.1">
              <dd className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.2rem)] leading-tight tracking-tight">Laktoositon</dd>
              <dt className="mt-2 text-[0.9rem] text-ash">kaikki tuotteet</dt>
            </div>
            <div className="border-t border-(--line-strong) pt-4" data-reveal="up" data-reveal-delay="0.15">
              <dd className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.2rem)] leading-tight tracking-tight">Gluteeniton</dd>
              <dt className="mt-2 text-[0.9rem] text-ash">tilauksesta</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* Menu browser */}
      <section id="menut" className="theme-cream grain relative scroll-mt-(--header-h) overflow-clip" aria-labelledby="menus-title">
        <div className="shell section relative z-10 !pt-16 lg:!pt-24">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow" data-reveal="up">
                Menut
              </p>
              <h2 id="menus-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
                Valitse <em>pöydän henki.</em>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2" data-reveal="up" data-reveal-delay="0.1">
              <p className="text-[0.95rem] leading-relaxed text-ash">{cateringNotes.dietary}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem]" aria-label="Ruokavaliomerkinnät">
                {(Object.keys(dietLegend) as DietCode[]).map((code) => (
                  <li key={code} className="inline-flex items-center gap-2">
                    <DietBadge code={code} />
                    <span className="text-ash">{dietLegend[code]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <div role="tablist" aria-label="Menukategoriat" className="flex gap-2 border-b border-(--line-strong) pb-4">
              {menuCategories.map((cat, index) => {
                const selected = category === cat.id;
                const count = menus.filter((m) => m.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`${baseId}-tab-${cat.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${cat.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setCategory(cat.id)}
                    onKeyDown={(e) => onTabKey(e, index)}
                    className="chip"
                  >
                    {cat.id === 'pikkujoulu' ? <Snowflake aria-hidden="true" className="size-4" /> : <Leaf aria-hidden="true" className="size-4" />}
                    {cat.label}
                    <span className="numeral text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {menuCategories.map((cat) => (
              <div
                key={cat.id}
                role="tabpanel"
                id={`${baseId}-panel-${cat.id}`}
                aria-labelledby={`${baseId}-tab-${cat.id}`}
                hidden={category !== cat.id}
                className="menu-panel"
              >
                <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-ash">{cat.description}</p>
                <ul className="mt-8 border-t border-(--line-strong)">
                  {menus
                    .filter((m) => m.category === cat.id)
                    .map((menu, index) => (
                      <MenuRow key={menu.id} menu={menu} defaultOpen={index === 0} />
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-3xl border-l-2 border-rust/60 pl-4 text-[0.88rem] leading-relaxed text-ash">{cateringNotes.pricing}</p>
        </div>
      </section>

      {/* Desserts and late-night snacks */}
      <section className="theme-night grain relative overflow-clip" aria-labelledby="extras-title">
        <div className="disc-glow -left-[20vw] top-[10%] h-[36vw] w-[80vw] opacity-40" aria-hidden="true" />
        <div className="shell section relative z-10">
          <p className="eyebrow" data-reveal="up">
            Illan jatkoksi
          </p>
          <h2 id="extras-title" className="display-lg mt-6 max-w-[16ch]" data-reveal="up" data-reveal-delay="0.05">
            Jälkiruoat ja <em>iltapalat.</em>
          </h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <MenuCard title="Jälkiruokaesimerkkejä" items={dessertExamples} note={cateringNotes.desserts} />
            <MenuCard title="Iltapalavaihtoehtoja" items={eveningSnackOptions} note="Hinta sopimuksen mukaan." delay={0.08} />
          </div>
          <p className="mt-10 max-w-2xl text-[0.95rem] leading-relaxed text-smoke" data-reveal="up">
            Toiveet pikkupurtavasta juhlakattaukseen kannattaa kertoa tarjouspyynnössä – valikoimassa suositaan oman maakunnan tuotteita, esimerkiksi
            riista- ja kalaherkkuja.
          </p>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Kerro menutoiveesi – <em>me hoidamme loput.</em>
          </>
        }
        text="Valitse menu valmiiksi tai kerro toiveistasi. Tarjouksessa vahvistetaan lopullinen hinta henkilöä kohden."
        query="?catering=kylla"
      />
    </>
  );
}

function DietBadge({ code }: { code: DietCode }) {
  return (
    <abbr
      title={dietLegend[code]}
      className="inline-grid h-5 min-w-5 place-items-center rounded-full border border-rust/50 px-1.5 text-[0.6rem] font-semibold tracking-wider text-rust no-underline"
    >
      {code}
    </abbr>
  );
}

function MenuRow({ menu, defaultOpen }: { menu: Menu; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const dishCount = menu.groups.reduce((n, g) => n + g.length, 0);

  return (
    <li className="border-b border-(--line-strong)">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen((v) => !v)}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 text-left sm:grid-cols-[minmax(9rem,auto)_1fr_auto_auto] sm:py-8"
        >
          <span className="font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] font-[340] leading-none tracking-tight transition-colors group-hover:text-rust">
            {menu.name}
          </span>
          <span className="col-span-2 row-start-2 text-[0.98rem] italic leading-snug text-ash sm:col-span-1 sm:row-start-1 sm:font-display sm:text-[1.15rem]">
            {menu.kicker}
            {menu.season && (
              <span className="ml-2 inline-flex translate-y-[-1px] items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 align-middle font-sans text-[0.7rem] font-semibold not-italic uppercase tracking-[0.12em] text-rust">
                {menu.category === 'pikkujoulu' ? <Snowflake aria-hidden="true" className="size-3" /> : <Flame aria-hidden="true" className="size-3" />}
                {menu.season}
              </span>
            )}
          </span>
          <span className="col-start-2 row-start-1 text-right sm:col-start-3">
            <span className="numeral text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-none">{menu.pricePerPerson}</span>
            <span className="ml-1 text-[0.85rem] text-ash">€ / hlö</span>
          </span>
          <span
            aria-hidden="true"
            className={cx(
              'hidden size-11 place-items-center rounded-full border border-(--line-strong) transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:border-ink sm:grid',
              open && 'rotate-45 bg-ink text-cream',
            )}
          >
            <Plus className="size-5" />
          </span>
        </button>
      </h3>

      <div id={`${id}-body`} className={cx('collapse-rows', open && 'is-open')} inert={!open}>
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-8 pb-10 pt-1 lg:grid-cols-12">
            <div className="lg:col-span-8 lg:col-start-1">
              <div className="rounded-xl bg-[#fbf6ee] p-6 ring-1 ring-ink/10 sm:p-9">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-rust">
                  {menu.name} · {dishCount} ruokalajia
                </p>
                <div className="mt-5 space-y-6">
                  {menu.groups.map((group, groupIndex) => (
                    <ul key={groupIndex} className={cx('space-y-2.5', groupIndex > 0 && 'border-t border-dashed border-ink/15 pt-6')}>
                      {group.map((item) => (
                        <li key={item.name} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[1.02rem] leading-snug">
                          <span>{item.name}</span>
                          {item.diets && (
                            <span className="inline-flex gap-1">
                              {item.diets.map((d) => (
                                <DietBadge key={d} code={d} />
                              ))}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                {menu.note && <p className="mt-6 border-t border-ink/10 pt-5 text-[0.92rem] italic text-ash">{menu.note}</p>}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 lg:col-span-4">
              <div className="space-y-3 text-[0.92rem] leading-relaxed text-ash">
                <p>
                  <strong className="font-semibold text-ink">{menu.pricePerPerson} € / hlö.</strong> Lopullinen hinta vahvistetaan tarjouksessa.
                </p>
                {menu.season && <p>Saatavilla: {menu.season.toLowerCase()}.</p>}
                <p>Kaikki tuotteet ovat laktoosittomia ja tilauksesta myös gluteenittomana.</p>
              </div>
              <Link to={`${pages.quote.path}?menu=${menu.id}`} className="btn btn--dark w-full sm:w-fit lg:w-full">
                Pyydä tarjous tällä menulla
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function MenuCard({ title, items, note, delay = 0 }: { title: string; items: string[]; note: string; delay?: number }) {
  return (
    <article className="relative rounded-sm bg-[#fbf6ee] px-7 py-10 text-ink shadow-2xl shadow-black/40 sm:px-12" data-reveal="up" data-reveal-delay={String(delay)}>
      <div className="pointer-events-none absolute inset-3 rounded-[2px] border border-ink/15" aria-hidden="true" />
      <h3 className="text-center font-display text-[1.9rem] font-light italic leading-none tracking-tight">{title}</h3>
      <ul className="mt-8">
        {items.map((item) => (
          <li key={item} className="border-t border-ink/10 py-4 text-center font-display text-[1.15rem] leading-snug tracking-tight first:border-t-0">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-rust">{note}</p>
    </article>
  );
}
