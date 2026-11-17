import type { ImageSlug } from './images.generated';

/**
 * Venue facts – all taken from the company's current website (page copy,
 * meta description and the descriptive texts in the page header) and from
 * what is plainly visible in the company's own photographs.
 */

export interface Photo {
  slug: ImageSlug;
  alt: string;
  caption?: string;
  /** CSS object-position used when the photo is cropped by its frame. */
  position?: string;
}

export interface Space {
  id: 'sali' | 'sauna' | 'pelitila';
  floor: 'Alakerta' | 'Yläkerta';
  name: string;
  headline: string;
  body: string[];
  features: string[];
  photos: Photo[];
}

export const spaces: Space[] = [
  {
    id: 'sali',
    floor: 'Alakerta',
    name: 'Juhla- ja ruokailutilat',
    headline: 'Sali, jossa avotakka kerää väen yhteen.',
    body: [
      'Alakerran ruokailu- ja seurustelutilat ovat talon sydän. Puukatto, avotakka ja suuret ikkunat terassille tekevät salista lämpimän – oli pöydässä kymmenen tai viisikymmentä vierasta.',
      'Sohvaryhmät, pyöreät pöydät ja oma tarjoilulinjasto antavat illalle vapaan muodon: syödään yhdessä, siirrytään seurustelemaan ja palataan pöytään, kun siltä tuntuu.',
    ],
    features: ['Tilat noin 10–50 hengelle', 'Avotakka', 'Ruokailu- ja seurustelutilat', 'Tarjoilulinjasto', 'Videotykki ja 75″ televisio', 'Äänentoisto'],
    photos: [
      { slug: 'sali-takka-portaat', alt: 'Juhlahumujen sali: puukatto, avotakka, tarjoilulinjasto ja portaat yläkertaan', caption: 'Sali ja portaat yläkerran pelitilaan' },
      { slug: 'sali-sohvat-takka', alt: 'Sohvaryhmä ja pöytä avotakan äärellä ilta-auringossa', caption: 'Sohvaryhmä avotakan äärellä' },
      { slug: 'sininen-sali', alt: 'Ruokailutila, jossa pyöreät pöydät ja riippuvalaisimet', caption: 'Ruokailutilan pyöreät pöydät' },
      { slug: 'sali-pyorea-poyta', alt: 'Pyöreä pöytä ja jouluinen somistus salin ikkunoiden edessä', caption: 'Sali pikkujoulusomistuksessa' },
    ],
  },
  {
    id: 'sauna',
    floor: 'Alakerta',
    name: 'Saunaosasto',
    headline: 'Löylyt hämärässä, vilvoittelu terassilla.',
    body: [
      'Tunnelmavalaistu sauna kuuluu tilavuokraan – samoin pyyhkeet ja pesuaineet. Saunatiloista pääsee suoraan ulkoterassille vilvoittelemaan.',
      'Terassille voi varata lisäpalveluna 10–12 hengen kylpytynnyrin, joka odottaa valmiiksi lämmitettynä.',
    ],
    features: ['Sauna sisältyy tilavuokraan', 'Pyyhkeet ja pesuaineet', 'Tunnelmavalaistus ja televisio', 'Käynti ulkoterassille', 'Kylpytynnyri lisäpalveluna'],
    photos: [
      { slug: 'sauna', alt: 'Tunnelmavalaistu sauna, jonka keskellä on pilarikiuas', caption: 'Tunnelmavalaistu sauna' },
      { slug: 'pukuhuone', alt: 'Saunaosaston pukuhuone puupenkkeineen', caption: 'Pukuhuone' },
      { slug: 'peilinurkkaus', alt: 'Peilinurkkaus ja kierreportaat saunaosaston yhteydessä', caption: 'Peilinurkkaus ja kierreportaat' },
    ],
  },
  {
    id: 'pelitila',
    floor: 'Yläkerta',
    name: 'Pelitila',
    headline: 'Yläkerrassa ilta saa uuden vaihteen.',
    body: [
      'Yläkerran pelitilassa on käytössä useita pelejä: biljardipöytä, ilmakiekko sekä voima- ja nopeuspelejä. Lisäksi löytyvät flipperi, darts ja pelikonsoli.',
      'Pelikoneet sisältyvät tilavuokraan, joten kisan voi aloittaa heti – ja jatkaa niin pitkään kuin ilta antaa myöten.',
    ],
    features: ['Biljardipöytä', 'Ilmakiekko', 'Voima- ja nopeuspelit', 'Flipperi', 'Darts', 'Pelikonsoli'],
    photos: [
      { slug: 'pelitila-panoraama', alt: 'Yläkerran pelitila: biljardipöytä ja pelejä värivaloissa', caption: 'Pelitila yläkerrassa' },
      { slug: 'biljardi', alt: 'Biljardipöytä, pallot ja kaksi keppiä', caption: 'Biljardi' },
      { slug: 'ilmakiekko-valot', alt: 'Ilmakiekkopöytä pelitilan värivaloissa', caption: 'Ilmakiekko' },
      { slug: 'pelitila-parvi', alt: 'Yläkerran parvi, jossa baarijakkarat sekä voima- ja nopeuspeli', caption: 'Parven pelinurkkaus' },
    ],
  },
];

export interface Amenity {
  id: string;
  label: string;
  detail: string;
  icon: 'speaker' | 'fridge' | 'ice' | 'glass' | 'plate' | 'towel' | 'parking' | 'staff' | 'clean' | 'wifi' | 'screen' | 'flame';
}

export const amenities: Amenity[] = [
  { id: 'aani', label: 'Äänentoisto', detail: 'Laadukkaan äänentoistojärjestelmän voi yhdistää esimerkiksi Spotifyhin – musiikki soi omasta puhelimesta Bluetoothilla.', icon: 'speaker' },
  { id: 'kylma', label: 'Kylmäkaapit', detail: 'Omille juomille ja tarjottaville on kylmäkaapit valmiina.', icon: 'fridge' },
  { id: 'jaa', label: 'Jääpalakone', detail: 'Jäitä riittää koko illaksi.', icon: 'ice' },
  { id: 'lasit', label: 'Lasit', detail: 'Viini-, kuohuviini-, konjakki- ja juomalasit sekä tuopit.', icon: 'glass' },
  { id: 'astiat', label: 'Astiat', detail: 'Astiat, kahviastiasto ja tarjoilukulhot, kun tilaukseen kuuluu ruoat.', icon: 'plate' },
  { id: 'pyyhkeet', label: 'Pyyhkeet ja pesuaineet', detail: 'Saunomiseen tarvittava on valmiina.', icon: 'towel' },
  { id: 'esitys', label: 'Esitystekniikka', detail: 'Videotykki ja 75″ televisio puheisiin, kuviin ja kisakatsomoon.', icon: 'screen' },
  { id: 'wifi', label: 'Langaton verkko', detail: 'Wi-Fi on käytettävissä tiloissa.', icon: 'wifi' },
  { id: 'parkki', label: '20 parkkipaikkaa', detail: 'Pysäköinti omassa pihassa.', icon: 'parking' },
  { id: 'henkilokunta', label: 'Henkilökunta', detail: 'Henkilökunta sisältyy tilavuokraan.', icon: 'staff' },
  { id: 'siivous', label: 'Loppusiivous', detail: 'Tavanomainen loppusiivous kuuluu hintaan.', icon: 'clean' },
  { id: 'takka', label: 'Avotakka', detail: 'Salin avotakka luo tunnelman.', icon: 'flame' },
];

export const venueFacts = [
  { value: '10–50', label: 'vierasta' },
  { value: '2', label: 'kerrosta' },
  { value: '16–24', label: 'esimerkkivuokra-aika' },
  { value: '20', label: 'parkkipaikkaa pihassa' },
] as const;

/** Meeting use – from juhlahumut.fi/kokous. */
export const meetings = {
  intro: 'Tilat ovat vuokrattavissa arkisin myös kokouskäyttöön. Tila soveltuu noin 20 henkilölle.',
  capacity: 'Noin 20 henkilöä',
  availability: 'Arkisin',
  equipment: [
    { label: 'Videotykki', detail: 'Esitykset isolle kankaalle' },
    { label: '75″ televisio', detail: 'Toinen näyttö esityksille' },
    { label: 'Äänentoistolaitteet', detail: 'Puhe ja musiikki kuuluvat koko tilaan' },
    { label: 'Langaton verkko', detail: 'Wi-Fi koko seurueelle' },
  ],
  catering: 'Halutessanne henkilökunta järjestää kahvituksen sekä lounaan paikan päälle.',
} as const;
