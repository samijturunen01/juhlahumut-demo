import { extras, rentalExample } from '@/data/pricing';
import { fromIso } from '@/lib/dates';
import type { QuoteRequest } from './types';

export interface Estimate {
  /** Published example price for the chosen group size, or null when it is priced by agreement. */
  rental: { label: string; priceInclVat: number | null; priceExclVat: number | null } | null;
  /** Separately priced extras the visitor ticked. */
  extras: { label: string; priceInclVat: number }[];
  /** True when the wished date falls in November or December, where weekend pricing is agreed separately. */
  christmasSeason: boolean;
}

/**
 * Looks up the company's PUBLISHED example prices for what the visitor selected.
 * It never calculates a quote: no totals, no catering sums, no availability.
 * The UI presents the result as an example and always alongside its conditions.
 */
export function estimateFor(request: Pick<QuoteRequest, 'guests' | 'date' | 'extras'>): Estimate {
  const tier = rentalExample.tiers.find((t) => t.id === request.guests);
  const date = request.date ? fromIso(request.date) : null;
  const month = date?.getMonth();

  return {
    rental: tier ? { label: tier.label, priceInclVat: tier.priceInclVat, priceExclVat: tier.priceExclVat } : null,
    extras: extras
      .filter((e) => e.priceInclVat !== null && (request.extras as string[]).includes(e.id))
      .map((e) => ({ label: e.name, priceInclVat: e.priceInclVat as number })),
    christmasSeason: month === 10 || month === 11,
  };
}
