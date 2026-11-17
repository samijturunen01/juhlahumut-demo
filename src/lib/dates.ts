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

export const WEEKDAYS_SHORT = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'] as const;
export const WEEKDAYS_LONG = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'] as const;

const MONTHS = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'] as const;
/** Partitive month names, as used in dates: "12. joulukuuta". */
const MONTHS_PARTITIVE = MONTHS.map((m) => `${m}ta`);

/*
 * Formatting is done by hand rather than with Intl: ICU versions disagree on Finnish
 * date forms ("lauantai" vs "lauantaina"), and the text must be identical in every browser.
 */

/** "lauantai 12. joulukuuta 2026" */
export const formatLongDate = (d: Date): string => `${WEEKDAYS_LONG[weekdayIndex(d)]} ${d.getDate()}. ${MONTHS_PARTITIVE[d.getMonth()]} ${d.getFullYear()}`;
/** "la 12.12.2026" */
export const formatShortDate = (d: Date): string => `${WEEKDAYS_SHORT[weekdayIndex(d)]} ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
/** "joulukuu 2026" */
export const formatMonthYear = (d: Date): string => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
