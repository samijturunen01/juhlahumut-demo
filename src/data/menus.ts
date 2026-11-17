/**
 * Catering menus – transcribed from juhlahumut.fi/menu.
 *
 * Dishes, order, groupings, dietary codes and per-person prices follow the
 * company's own menu page. Only obvious spelling slips were corrected (listed
 * in docs/CONTENT_VERIFICATION.md). Nothing was added, removed or re-priced.
 *
 * Groups: for Menu 1–5 they mirror the paragraph breaks of the original page.
 * The two Christmas menus are listed one dish per line in the source; here they
 * are split into visual groups at natural points with the ORIGINAL ORDER kept.
 * Groups are left unnamed on purpose, because the source does not name courses.
 */

export type DietCode = 'M' | 'L' | 'VL' | 'G';

export const dietLegend: Record<DietCode, string> = {
  M: 'maidoton',
  L: 'laktoositon',
  VL: 'vähälaktoosinen',
  G: 'gluteeniton',
};

export interface MenuItem {
  name: string;
  diets?: DietCode[];
}

export interface Menu {
  id: string;
  category: 'juhlamenu' | 'pikkujoulu';
  name: string;
  /** Short editorial label – descriptive only, derived from the dishes on the menu. */
  kicker?: string;
  pricePerPerson: number;
  /** Seasonal availability, when the source states one. */
  season?: string;
  groups: MenuItem[][];
  note?: string;
}

const i = (name: string, diets?: DietCode[]): MenuItem => (diets ? { name, diets } : { name });

export const menus: Menu[] = [
  {
    id: 'menu-1',
    category: 'juhlamenu',
    name: 'Menu 1',
    kicker: 'Parmesanpariloitua broileria',
    pricePerPerson: 33,
    groups: [
      [
        i('Vihersalaattia ja salaatinkastiketta', ['M', 'G']),
        i('Tomaatti-parmesansalaattia', ['L', 'G']),
        i('Pekoni-pastasalaattia', ['M']),
      ],
      [
        i('Parmesanpariloitua broileria, sweet chili crème fraîche ja paprikahilloketta', ['VL', 'G']),
        i('Kevyesti savustettua perunaa', ['M', 'G']),
        i('Paahdettuja kasviksia'),
      ],
      [i('Valkosipulileipää ja patonkia'), i('Voita ja tuorejuustoa')],
    ],
  },
  {
    id: 'menu-2',
    category: 'juhlamenu',
    name: 'Menu 2',
    kicker: 'Ylikypsää porsasta, friteerattua kanaa ja pannupitsaa',
    pricePerPerson: 35,
    groups: [
      [
        i('Vihersalaattia ja salaatinkastiketta', ['M', 'G']),
        i('Coleslawsalaattia', ['L', 'G']),
        i('Paahdettu peruna-pekonisalaatti', ['M', 'G']),
      ],
      [
        i('Chiliglaseerattua ylikypsää porsasta', ['M', 'G']),
        i('Friteerattua kanaa', ['M', 'G']),
        i('Pannupitsaa (pepperoni, mozzarella, tomaatti)', ['L']),
        i('Crème fraîchea', ['L', 'G']),
        i('Paprikahilloketta', ['M', 'G']),
      ],
      [i('Valkosipulileipää ja patonkia'), i('Voita ja tuorejuustoa')],
    ],
  },
  {
    id: 'menu-3',
    category: 'juhlamenu',
    name: 'Menu 3',
    kicker: 'Leivitetty porsaanleike ja pippurikermakastike',
    pricePerPerson: 30,
    groups: [
      [i('Vihersalaattia ja salaatinkastiketta'), i('Pastasalaattia')],
      [i('Leivitetty porsaanleike'), i('Paistetut perunat'), i('Pippurikermakastike')],
      [i('Patonkia'), i('Voita ja tuorejuustoa')],
    ],
  },
  {
    id: 'menu-4',
    category: 'juhlamenu',
    name: 'Menu 4',
    kicker: 'Voissa paistettua kuhaa ja savustettua porsasta',
    pricePerPerson: 40,
    groups: [
      [
        i('Vihersalaattia, salaatinkastiketta', ['M', 'G']),
        i('Broileri-caesarsalaattia', ['L']),
        i('Grillattuja kasviksia, revittyä mozzarellaa ja sitrusvinaigrettea', ['G']),
        i('Tomaatti-punasipulisalaattia', ['M', 'G']),
      ],
      [i('Sokerisuolattua lohta', ['M', 'G']), i('Mehevää yrttiporsasta', ['M', 'G'])],
      [
        i('Voissa paistettua kuhaa ja ruohosipuli-crème fraîchea', ['L', 'G']),
        i('Miedosti savustettua ylikypsää porsasta, madeirakastiketta'),
        i('Paahdettua perunaa ja kasviksia'),
      ],
      [i('Mallasleipää ja vaaleaa leipää'), i('Voita ja tuorejuustoa')],
    ],
  },
  {
    id: 'menu-5',
    category: 'juhlamenu',
    name: 'Menu 5',
    kicker: 'Hiiligrillistä',
    pricePerPerson: 35,
    season: 'Touko–syyskuu',
    groups: [
      [i('Vihersalaattia ja salaatinkastiketta'), i('Pastasalaattia')],
      [i('Porsaanfileepihvit ja/tai kananrintapalat'), i('Kermaperunat ja riisi')],
      [i('Patonkia'), i('Tuorejuustoa ja voita')],
    ],
    note: 'Paistetaan argentiinalaistyylisessä hiiligrillissä paikan päällä.',
  },
  {
    id: 'pikkujoulumenu-1',
    category: 'pikkujoulu',
    name: 'Pikkujoulumenu I',
    kicker: 'Joulukinkkua, karjalanpaistia ja laatikot',
    pricePerPerson: 42,
    season: 'Pikkujoulukausi',
    groups: [
      [
        i('Vihersalaattia, talon salaatinkastiketta'),
        i('Perinteistä metsäsienisalaattia'),
        i('Rosollia ja punajuurikermaa'),
        i('Jouluinen juustosalaatti ja paahdettua kurpitsansiementä'),
      ],
      [i('Graavilohta'), i('Smetanasilliä'), i('Lasimestarinsilliä'), i('Katkarapuskagenia')],
      [
        i('Perinteistä joulukinkkua ja sinappia'),
        i('Karjalanpaistia'),
        i('Porkkanalaatikkoa'),
        i('Lanttulaatikkoa'),
        i('Keitetyt perunat ja tillivoita'),
      ],
      [i('Karjalanpiirakoita ja munavoita'), i('Mallasleipää ja levitettä')],
      [i('Vesi ja kotikalja'), i('Kahvi / tee'), i('Joulutorttuja ja piparkakkuja')],
    ],
  },
  {
    id: 'pikkujoulumenu-2',
    category: 'pikkujoulu',
    name: 'Pikkujoulumenu II',
    kicker: 'Haudutettua possua ja pariloitua lohta',
    pricePerPerson: 45,
    season: 'Pikkujoulukausi',
    groups: [
      [
        i('Viherversosalaattia ja sitruunavinegrettiä'),
        i('Broileri-caesarsalaattia ja krutonkeja'),
        i('Valkosipulilla ja yrteillä paahdettua perunasalaattia ja omena-sinappidressingiä'),
        i('Jouluinen juustosalaatti ja paahdettua kurpitsansiementä'),
        i('Seesamilla paahdettua punajuurta ja pähkinää'),
      ],
      [
        i('Graavilohta ja fenkoli-kurkkusalaattia'),
        i('Rosépaahdettua paahtopaistia ja piparjuurimajoneesia'),
        i('Katkarapuskagenia'),
        i('Metsäsienimoussea'),
        i('Savuporomoussea'),
        i('Saaristolaisleipää'),
      ],
      [
        i('Pitkään haudutettua possua ja tummaa omenasiiderikastiketta'),
        i('Pariloitua lohta ja ruohosipuli-valkoviinikastiketta'),
        i('Paahdettua fenkoliperunaa'),
        i('Vaalealla balsamicolla paahdettuja juureksia'),
        i('Karjalanpiirakoita ja munavoita'),
      ],
      [i('Vesi ja kotikaljaa'), i('Kahvi / tee'), i('Suklaafondant'), i('Salty caramel fudge'), i('Puolukkatartalet')],
    ],
  },
];

export const menuCategories = [
  { id: 'juhlamenu', label: 'Juhlamenut', description: 'Viisi valmista kokonaisuutta ympäri vuoden – Menu 5 hiiligrillistä kesäkaudella.' },
  { id: 'pikkujoulu', label: 'Pikkujoulumenut', description: 'Kaksi joulupöytää pikkujoulukauden juhliin.' },
] as const;

export const dessertExamples = ['Vaniljapannacotta ja raparperihilloketta', 'Porkkanapiirakkaa', 'Täytekakku'];

export const eveningSnackOptions = [
  'Feta-kasvis-, kylmäsavulohi-, poro- tai kinkkupiirakkaa',
  'Riisipiirakkaa, juustoa, leikkelettä ja kurkkua',
  'Grillimakkaraa',
];

export const cateringNotes = {
  intro:
    'Catering-palvelussa asiakkaan toiveet toteutetaan pikkupurtavasta juhlakattauksiin. Valikoimassa suositaan oman maakunnan tuotteita, esimerkiksi riista- ja kalaherkkuja.',
  dietary: 'Kaikki tuotteet ovat laktoosittomia ja tilauksesta myös gluteenittomana.',
  desserts: 'Jälkiruoat sopimuksen mukaan.',
  /**
   * The current site states "Hinnat / hlö, sis. alv 14 %". That VAT rate is outdated,
   * so it is NOT repeated here. The owner must confirm current tax-inclusive prices.
   */
  pricing: 'Hinnat ovat henkilöä kohden. Lopullinen hinta ja arvonlisävero vahvistetaan tarjouksessa.',
} as const;

export const menuPriceRange = {
  min: Math.min(...menus.map((m) => m.pricePerPerson)),
  max: Math.max(...menus.map((m) => m.pricePerPerson)),
};

export const getMenu = (id: string) => menus.find((m) => m.id === id);
