import type { ImageSlug } from './images.generated';

/**
 * Occasions the company itself names on its current website
 * ("juhlat, pikkujoulut, virkistyspäivät, polttarit, saunaillat", "polttarit tai häät",
 * "työpaikan pikkujoulut", "peli-ilta isolle porukalle", meeting use on weekdays).
 * The descriptions only combine facilities that are verified elsewhere in /data.
 */
export interface Occasion {
  id: string;
  name: string;
  line: string;
  image: ImageSlug;
  imagePosition?: string;
  /** Where the row links to. Defaults to the quote form with this occasion preselected. */
  to?: string;
}

export const occasions: Occasion[] = [
  { id: 'pikkujoulut', name: 'Pikkujoulut', line: 'Joulupöytä, löylyt ja pelit saman katon alla.', image: 'sali-pyorea-poyta' },
  { id: 'yritysjuhlat', name: 'Yritysjuhlat ja virkistyspäivät', line: 'Työporukan ilta ilman naapuripöytiä.', image: 'sininen-sali' },
  { id: 'polttarit', name: 'Polttarit', line: 'Kisa käyntiin yläkerran pelitilassa.', image: 'nyrkkeilypeli', imagePosition: '50% 30%' },
  { id: 'saunaillat', name: 'Saunaillat', line: 'Tunnelmavalaistu sauna ja terassi isolle porukalle.', image: 'sauna' },
  { id: 'peli-illat', name: 'Peli-illat', line: 'Biljardia, ilmakiekkoa ja kisailua koko seurueelle.', image: 'ilmakiekko' },
  { id: 'haat-ja-juhlat', name: 'Häät ja yksityisjuhlat', line: 'Oma tila, omat juomat ja oma tahti.', image: 'sali-sohvat-takka' },
  { id: 'kokoukset', name: 'Kokoukset', line: 'Arkisin noin 20 hengelle – tekniikka valmiina.', image: 'sali-takka-portaat', to: '/kokoukset' },
];

/** Options for the "type of occasion" field of the quote form. */
export const occasionOptions = [
  ...occasions.map((o) => ({ id: o.id, label: o.name })),
  { id: 'muu', label: 'Muu tilaisuus' },
];
