const eur0 = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "790 €" */
export const formatEuro = (value: number): string => eur0.format(value).replace(/ /g, ' ');

/** "629,48 €" */
export const formatEuroExact = (value: number): string => eur2.format(value).replace(/ /g, ' ');

export const cx = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(' ');
