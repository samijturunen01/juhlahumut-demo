/** Small, dependency-free date helpers for the date picker. All dates are LOCAL calendar days ("YYYY-MM-DD"). */

export const toIso = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromIso = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // reject overflow such as 2026-02-31
  return d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : null;
};

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const addMonths = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth() + n, 1);

export const isSameDay = (a: Date, b: Date): boolean => toIso(a) === toIso(b);

export const isBeforeDay = (a: Date, b: Date): boolean => toIso(a) < toIso(b);

/** Monday-first weekday index: 0 = Monday … 6 = Sunday. */
export const weekdayIndex = (d: Date): number => (d.getDay() + 6) % 7;

/**
 * The days shown for a month: whole weeks, Monday first. Days outside the month are
 * included (as `inMonth: false`) so every row has seven cells.
 */
export function monthGrid(year: number, month: number): { date: Date; inMonth: boolean }[][] {
  const first = new Date(year, month, 1);
  const start = addDays(first, -weekdayIndex(first));
  const weeks: { date: Date; inMonth: boolean }[][] = [];
  let cursor = start;
  do {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push({ date: cursor, inMonth: cursor.getMonth() === month });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  } while (cursor.getMonth() === month);
  return weeks;
}

const longDate = new Intl.DateTimeFormat('fi-FI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('fi-FI', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' });
const monthYear = new Intl.DateTimeFormat('fi-FI', { month: 'long', year: 'numeric' });

/** "lauantai 12. joulukuuta 2026" */
export const formatLongDate = (d: Date): string => longDate.format(d);
/** "la 12.12.2026" */
export const formatShortDate = (d: Date): string => shortDate.format(d);
/** "joulukuu 2026" */
export const formatMonthYear = (d: Date): string => monthYear.format(d);

export const WEEKDAYS_SHORT = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'] as const;
export const WEEKDAYS_LONG = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'] as const;
