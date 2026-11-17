/**
 * Company details.
 *
 * Every value here was read from the company's current website (juhlahumut.fi).
 * Fields the current site does not publish are deliberately `null` – they must
 * not be guessed. See docs/CONTENT_VERIFICATION.md.
 */
export const company = {
  name: 'Juhlahumut',
  descriptor: 'Juhlatila, saunatila ja catering Joensuussa',
  address: {
    street: 'Aspitie 33',
    city: 'Joensuu',
    /** Not published on the current site. */
    postalCode: null as string | null,
    country: 'FI',
  },
  phone: {
    display: '0400 304 944',
    href: 'tel:+358400304944',
    e164: '+358400304944',
  },
  /** The current site publishes no e-mail address. */
  email: null as string | null,
  /** The current site publishes no opening hours – the venue is rented by reservation. */
  openingHours: null as string | null,
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aspitie+33%2C+Joensuu',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aspitie+33%2C+Joensuu',
  locationNote: 'Hyvien kulkuyhteyksien päässä, rauhallisessa ympäristössä.',
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@juhlahumut', url: 'https://www.instagram.com/juhlahumut/' },
    { id: 'tiktok', label: 'TikTok', handle: '@juhlahumut', url: 'https://www.tiktok.com/@juhlahumut' },
  ],
  /** The company's own presentation video, hosted on its YouTube channel. Linked, never re-hosted. */
  videoUrl: 'https://www.youtube.com/watch?v=vRlLUoUFk_c',
  officialSiteUrl: 'https://juhlahumut.fi/',
  capacity: { min: 10, max: 50 },
  parkingSpaces: 20,
} as const;

export const demoNotice = {
  short: 'Konseptidemo',
  long: 'Tämä on sivuston uudistuskonsepti, ei Juhlahumujen virallinen verkkosivusto. Tarjouspyyntölomake on demotilassa: mitään ei lähetetä eikä tallenneta.',
} as const;
