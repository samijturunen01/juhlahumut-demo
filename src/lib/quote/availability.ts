/**
 * Availability – the seam for a future booking calendar.
 *
 * The demo has NO access to the company's calendar, so every date is "unknown"
 * and the date picker says so. Three states are kept strictly apart, in the
 * types and in the UI wording:
 *
 *   - a visitor's PREFERRED date   (what the form collects today)
 *   - CONFIRMED AVAILABILITY       ("free" / "booked" – only an authoritative calendar can say)
 *   - a CONFIRMED RESERVATION      (only the company can make one; never created by this site)
 *
 * To integrate later: implement `AvailabilityProvider` against the authoritative
 * calendar (e.g. an Apps Script endpoint that reads the company's Google Calendar
 * and returns only free/booked flags) and pass it to <DatePicker availability={…} />.
 * Nothing else in the form has to change.
 */
export type Availability = 'unknown' | 'free' | 'booked';

export interface AvailabilityProvider {
  /** True only when backed by an authoritative calendar. The UI shows availability colours only then. */
  readonly authoritative: boolean;
  /** Availability for each local day ("YYYY-MM-DD") of the given month. */
  getMonth(year: number, month: number): Promise<Record<string, Availability>>;
}

/** The demo provider: knows nothing, claims nothing. */
export const unknownAvailability: AvailabilityProvider = {
  authoritative: false,
  getMonth: async () => ({}),
};
