import type { ImageSlug } from './images.generated';

/**
 * Route table: one entry per page. Shared by the router, the navigation,
 * the client-side document metadata and the static prerender script.
 */
export interface PageMeta {
  path: string;
  /** Label used in navigation. */
  nav: string;
  title: string;
  description: string;
  inMainNav?: boolean;
  /** Image preloaded for LCP on this page. */
  preloadImage?: ImageSlug;
}

export const pages = {
  home: {
    path: '/',
    nav: 'Etusivu',
    title: 'Juhlahumut – Juhlatila, saunatila ja catering Joensuussa',
    description:
      'Yksityinen juhlatila Joensuussa 10–50 hengelle: sali ja avotakka, tunnelmallinen sauna, pelitila ja catering. Esimerkkihinnat alkaen 790 €. Pyydä tarjous.',
    inMainNav: true,
    preloadImage: 'hero-sali',
  },
  venue: {
    path: '/juhlatilat',
    nav: 'Juhlatilat',
    title: 'Juhlatilat ja saunatila Joensuussa – Juhlahumut',
    description:
      'Kaksi kerrosta yksityiskäyttöön: sali ja avotakka, saunaosasto ja terassi sekä yläkerran pelitila biljardeineen. Tutustu Juhlahumujen tiloihin Joensuussa.',
    inMainNav: true,
    preloadImage: 'sali-takka-portaat',
  },
  pricing: {
    path: '/hinnasto',
    nav: 'Hinnasto',
    title: 'Hinnasto – juhlatilan vuokraus Joensuussa | Juhlahumut',
    description:
      'Juhlatilan esimerkkihinnat klo 16–24: alle 20 henkilöä 790 €, 20–30 henkilöä 950 €. Katso, mitä tilavuokraan sisältyy, lisäpalvelut ja peruutusehdot.',
    inMainNav: true,
  },
  catering: {
    path: '/catering',
    nav: 'Catering',
    title: 'Catering ja juhlamenut Joensuussa – Juhlahumut',
    description:
      'Juhlahumujen catering: viisi juhlamenua ja kaksi pikkujoulumenua, 30–45 € / hlö. Kaikki tuotteet laktoosittomia, tilauksesta gluteenittomana.',
    inMainNav: true,
  },
  gallery: {
    path: '/galleria',
    nav: 'Galleria',
    title: 'Galleria – kuvia juhlatilasta, saunasta ja pelitilasta | Juhlahumut',
    description: 'Katso kuvia Juhlahumujen juhlatilasta Joensuussa: sali ja avotakka, tunnelmavalaistu sauna ja yläkerran pelitila.',
    inMainNav: true,
  },
  contact: {
    path: '/yhteystiedot',
    nav: 'Yhteystiedot',
    title: 'Yhteystiedot – Juhlahumut, Aspitie 33, Joensuu',
    description: 'Juhlahumut sijaitsee Joensuussa osoitteessa Aspitie 33. Soita 0400 304 944 tai pyydä tarjous juhlatilasta, saunasta ja cateringista.',
    inMainNav: true,
  },
  quote: {
    path: '/tarjouspyynto',
    nav: 'Pyydä tarjous',
    title: 'Pyydä tarjous juhlatilasta – Juhlahumut Joensuu',
    description: 'Kerro tilaisuudestasi, toivomastasi päivästä ja henkilömäärästä – pyydä tarjous Juhlahumujen juhlatilasta, saunasta ja cateringista.',
  },
  meetings: {
    path: '/kokoukset',
    nav: 'Kokoukset',
    title: 'Kokoustila Joensuussa noin 20 hengelle – Juhlahumut',
    description: 'Juhlahumujen tilat ovat arkisin vuokrattavissa kokouskäyttöön noin 20 hengelle: videotykki, 75″ televisio, äänentoisto ja langaton verkko.',
  },
  notFound: {
    path: '/404',
    nav: 'Sivua ei löytynyt',
    title: 'Sivua ei löytynyt – Juhlahumut',
    description: 'Etsimääsi sivua ei löytynyt. Palaa Juhlahumujen etusivulle tai tutustu juhlatiloihin, hinnastoon ja catering-menuihin.',
  },
} as const satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof pages;

export const mainNav = (Object.values(pages) as PageMeta[]).filter((p) => p.inMainNav);

/** Pages that get a prerendered HTML file. */
export const prerenderPaths = (Object.values(pages) as PageMeta[]).filter((p) => p.path !== '/404').map((p) => p.path);

export function findPageByPath(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return (Object.values(pages) as PageMeta[]).find((p) => p.path === clean) ?? pages.notFound;
}
