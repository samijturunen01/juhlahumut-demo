/**
 * Venue rental pricing – transcribed from juhlahumut.fi/hinnasto.
 *
 * IMPORTANT: these are the company's published EXAMPLE prices for one specific
 * rental window and season. They are not universal fixed prices, and the UI
 * must always present them together with `rentalExample.conditions`.
 */

export interface RentalTier {
  id: 'alle-20' | '20-30' | 'yli-30';
  label: string;
  guests: string;
  /** Price including VAT, as published. `null` = priced by agreement. */
  priceInclVat: number | null;
  /** VAT-free price, as published. */
  priceExclVat: number | null;
  note?: string;
}

export const rentalExample = {
  timeWindow: 'klo 16–24',
  /** The exact scope of the published example prices. */
  conditions: 'Esimerkkihinnat tilavuokrasta klo 16–24 pikkujoulukauden ulkopuolella (pl. marras–joulukuun viikonloput).',
  otherTimes: 'Muuna aikana hinta sovitaan erikseen.',
  tiers: [
    { id: 'alle-20', label: 'Alle 20 henkilöä', guests: 'alle 20', priceInclVat: 790, priceExclVat: 629.48 },
    { id: '20-30', label: '20–30 henkilöä', guests: '20–30', priceInclVat: 950, priceExclVat: 756.97 },
    {
      id: 'yli-30',
      label: 'Yli 30 henkilöä',
      guests: 'yli 30',
      priceInclVat: null,
      priceExclVat: null,
      note: 'Hinta sovitaan seurueen koon ja tilaisuuden mukaan.',
    },
  ] satisfies RentalTier[],
} as const;

export interface Inclusion {
  id: string;
  label: string;
  detail?: string;
  /** Marks an inclusion that only applies under a condition. */
  conditional?: boolean;
}

/** "Tilavuokraan sisältyy" – in the order the company lists them. */
export const rentalInclusions: Inclusion[] = [
  { id: 'sauna', label: 'Sauna' },
  { id: 'pyyhkeet', label: 'Pyyhkeet ja pesuaineet' },
  { id: 'pelit', label: 'Pelikoneet' },
  { id: 'lasit', label: 'Lasit', detail: 'Viini-, kuohuviini-, konjakki- ja juomalasit sekä tuopit' },
  {
    id: 'astiat',
    label: 'Astiat, kahviastiasto ja tarjoilukulhot',
    detail: 'Sisältyvät, kun tilaukseen kuuluu ruoat',
    conditional: true,
  },
  { id: 'kylmakaapit', label: 'Kylmäkaapit' },
  { id: 'jaapalakone', label: 'Jääpalakone' },
  { id: 'henkilokunta', label: 'Henkilökunta' },
  { id: 'pysakointi', label: '20 parkkipaikkaa pihassa' },
  { id: 'siivous', label: 'Tavanomainen loppusiivous' },
];

export interface Extra {
  id: string;
  name: string;
  summary: string;
  priceInclVat: number | null;
  priceLabel: string;
  note?: string;
  link?: { to: string; label: string };
}

/** Separately priced services. */
export const extras: Extra[] = [
  {
    id: 'kylpytynnyri',
    name: 'Kylpytynnyri',
    summary: '10–12 hengen kylpytynnyri, vuokrattavissa viideksi tunniksi valmiiksi lämmitettynä.',
    priceInclVat: 250,
    priceLabel: '250 €',
    note: '5 tuntia · valmiiksi lämmitetty',
  },
  {
    id: 'catering',
    name: 'Catering',
    summary: 'Valmiit menut salaateista pääruokiin sekä pikkujoulukauden juhlamenut. Jälkiruoat ja iltapalat sopimuksen mukaan.',
    priceInclVat: null,
    priceLabel: '30–45 € / hlö',
    note: 'Menun mukaan',
    link: { to: '/catering', label: 'Tutustu menuihin' },
  },
];

export const rentalTerms = {
  ownDrinks: 'Juhlatilaan saa tuoda omat alkoholijuomat – tilaisuus on aina yksityinen.',
  ownFood: 'Omat ruoat sopimuksen mukaan.',
  cancellation: {
    freeUntilDays: 30,
    lateFee: 500,
    text: 'Voit perua tilavuokrauksen viimeistään 30 vuorokautta ennen vuokrauspäivää. Myöhemmin perutuista tilavuokrauksista peritään 500 €:n varausmaksu.',
  },
} as const;
