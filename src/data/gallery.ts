import type { ImageSlug } from './images.generated';

export type GalleryCategory = 'sali' | 'sauna' | 'pelit';

export interface GalleryItem {
  slug: ImageSlug;
  category: GalleryCategory;
  alt: string;
  caption: string;
}

export const galleryCategories: { id: GalleryCategory | 'kaikki'; label: string }[] = [
  { id: 'kaikki', label: 'Kaikki' },
  { id: 'sali', label: 'Sali' },
  { id: 'sauna', label: 'Sauna' },
  { id: 'pelit', label: 'Pelitila' },
];

/** All 19 original photographs from the company's own gallery, in a curated order. */
export const galleryItems: GalleryItem[] = [
  { slug: 'sali-ilta-aurinko', category: 'sali', alt: 'Alakerran sali ilta-auringossa: avotakka, tarjoilulinjasto ja sohvaryhmä', caption: 'Sali ilta-auringossa' },
  { slug: 'biljardi', category: 'pelit', alt: 'Biljardipöytä, pallot ja kaksi keppiä', caption: 'Biljardi' },
  { slug: 'sauna', category: 'sauna', alt: 'Tunnelmavalaistu sauna, jonka keskellä on pilarikiuas', caption: 'Tunnelmavalaistu sauna' },
  { slug: 'sali-sohvat-takka', category: 'sali', alt: 'Sohvaryhmä ja pöytä avotakan äärellä', caption: 'Sohvaryhmä avotakan äärellä' },
  { slug: 'ilmakiekko-valot', category: 'pelit', alt: 'Ilmakiekkopöytä pelitilan värivaloissa', caption: 'Ilmakiekko ja pelitilan valot' },
  { slug: 'sininen-sali', category: 'sali', alt: 'Ruokailutila, jossa pyöreät pöydät ja riippuvalaisimet', caption: 'Ruokailutilan pyöreät pöydät' },
  { slug: 'nyrkkeilypeli', category: 'pelit', alt: 'Nyrkkeilypeli yläkerran pelitilassa', caption: 'Nyrkkeilypeli' },
  { slug: 'pelitila-panoraama', category: 'pelit', alt: 'Yläkerran pelitila: biljardipöytä ja pelejä värivaloissa', caption: 'Pelitila yläkerrassa' },
  { slug: 'sali-takka-portaat', category: 'sali', alt: 'Sali: puukatto, avotakka, tarjoilulinjasto ja portaat yläkertaan', caption: 'Sali ja portaat yläkertaan' },
  { slug: 'pukuhuone', category: 'sauna', alt: 'Saunaosaston pukuhuone puupenkkeineen', caption: 'Saunaosaston pukuhuone' },
  { slug: 'ilmakiekko', category: 'pelit', alt: 'Ilmakiekkopöytä ja mailat lähikuvassa', caption: 'Ilmakiekko' },
  { slug: 'pelikabinetti', category: 'pelit', alt: 'Pelikabinetti, jossa klassisia videopelejä', caption: 'Pelikabinetti' },
  { slug: 'sali-pyorea-poyta', category: 'sali', alt: 'Pyöreä pöytä ja jouluinen somistus salin ikkunoiden edessä', caption: 'Sali pikkujoulusomistuksessa' },
  { slug: 'flipperi-voimapeli', category: 'pelit', alt: 'Flipperi ja voimapeli', caption: 'Flipperi ja voimapeli' },
  { slug: 'peilinurkkaus', category: 'sauna', alt: 'Peilinurkkaus ja kierreportaat', caption: 'Peilinurkkaus ja kierreportaat' },
  { slug: 'voimapeli', category: 'pelit', alt: 'Voimapeli yläkerran parvella', caption: 'Voimapeli' },
  { slug: 'pelitila-parvi', category: 'pelit', alt: 'Yläkerran parvi, jossa baarijakkarat sekä voima- ja nopeuspeli', caption: 'Parven pelinurkkaus' },
  { slug: 'nopeuspeli', category: 'pelit', alt: 'Nopeuspeli yläkerran parvella', caption: 'Nopeuspeli' },
  { slug: 'pelipoyta', category: 'pelit', alt: 'Kosketusnäytöllinen pelipöytä', caption: 'Pelipöytä' },
];
