const eur0 = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Every space variant ICU may emit (space, no-break space, narrow no-break space). */
const ANY_SPACE = /[\s\u00a0\u202f]/g;
const NBSP = '\u00a0';

/**
 * "790 €" – spaces are normalised to a no-break space, so the amount never wraps away
 * from its currency sign and the server (prerender) and browser render identical text.
 */
export const formatEuro = (value: number): string => eur0.format(value).replace(ANY_SPACE, NBSP);

/** "629,48 €" */
export const formatEuroExact = (value: number): string => eur2.format(value).replace(ANY_SPACE, NBSP);

export const cx = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(' ');
