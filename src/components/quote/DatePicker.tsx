import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import {
  addDays,
  addMonths,
  formatLongDate,
  formatMonthYear,
  fromIso,
  isBeforeDay,
  monthGrid,
  startOfDay,
  toIso,
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
  weekdayIndex,
} from '@/lib/dates';
import { cx } from '@/lib/format';

interface DatePickerProps {
  /** Selected local day "YYYY-MM-DD", or "" */
  value: string;
  onChange: (iso: string) => void;
  invalid?: boolean;
  /** id of the visible label (the fieldset legend) */
  labelledBy: string;
  describedBy?: string;
  /** Injectable for tests. Defaults to the visitor's current day. */
  today?: Date;
}

/**
 * Inline month calendar for choosing a PREFERRED date.
 *
 * It intentionally shows no availability: the demo has no access to the venue's
 * calendar, and the caption says so. (See lib/quote/availability.ts for the seam
 * a real calendar would plug into.)
 *
 * Accessibility: a real grid of buttons with full Finnish date labels, roving
 * tabindex, arrow keys / Home / End / PageUp / PageDown, 44px+ touch targets,
 * past days disabled. Rendered after mount only, because "today" belongs to the
 * visitor's clock, not to the build.
 */
export function DatePicker({ value, onChange, invalid = false, labelledBy, describedBy, today: todayProp }: DatePickerProps) {
  const mounted = useMounted();
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const selected = value ? fromIso(value) : null;

  const [view, setView] = useState(() => {
    const base = selected && !isBeforeDay(selected, today) ? selected : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [focusIso, setFocusIso] = useState(() => toIso(selected && !isBeforeDay(selected, today) ? selected : today));
  const moveFocus = useRef(false);
  const grid = useRef<HTMLTableSectionElement>(null);

  const weeks = useMemo(() => monthGrid(view.getFullYear(), view.getMonth()), [view]);
  const isCurrentMonth = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  // After keyboard navigation, put DOM focus on the newly active day.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focusIso}"]`)?.focus();
  }, [focusIso, view]);

  const focusDate = (date: Date) => {
    const target = isBeforeDay(date, today) ? today : date;
    moveFocus.current = true;
    setFocusIso(toIso(target));
    if (target.getMonth() !== view.getMonth() || target.getFullYear() !== view.getFullYear()) {
      setView(new Date(target.getFullYear(), target.getMonth(), 1));
    }
  };

  const changeMonth = (delta: number) => {
    const next = addMonths(view, delta);
    if (isBeforeDay(new Date(next.getFullYear(), next.getMonth() + 1, 0), today)) return;
    setView(next);
    // keep a tabbable day inside the visible month
    const first = new Date(next.getFullYear(), next.getMonth(), 1);
    setFocusIso(toIso(isBeforeDay(first, today) ? today : first));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTableSectionElement>) => {
    const current = fromIso(focusIso);
    if (!current) return;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(current, -1),
      ArrowRight: () => addDays(current, 1),
      ArrowUp: () => addDays(current, -7),
      ArrowDown: () => addDays(current, 7),
      Home: () => addDays(current, -weekdayIndex(current)),
      End: () => addDays(current, 6 - weekdayIndex(current)),
      PageUp: () => new Date(current.getFullYear(), current.getMonth() - 1, current.getDate()),
      PageDown: () => new Date(current.getFullYear(), current.getMonth() + 1, current.getDate()),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    focusDate(move());
  };

  if (!mounted) {
    // Stable placeholder with the calendar's dimensions – no layout shift when it appears.
    return <div className="h-[25.5rem] rounded-2xl border border-(--line-strong) bg-(--surface)" aria-hidden="true" />;
  }

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cx('rounded-2xl border bg-(--surface) p-4 sm:p-6', invalid ? 'border-[#b3261e] ring-[3px] ring-[#b3261e]/15' : 'border-(--line-strong)')}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={isCurrentMonth}
          aria-label="Edellinen kuukausi"
          className="grid size-11 place-items-center rounded-full border border-(--line-strong) transition-colors hover:border-(--fg) disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <p className="font-display text-[1.35rem] font-[360] tracking-tight first-letter:uppercase" aria-live="polite">
          {formatMonthYear(view)}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Seuraava kuukausi"
          className="grid size-11 place-items-center rounded-full border border-(--line-strong) transition-colors hover:border-(--fg)"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>

      <table role="grid" aria-label={`Kalenteri, ${formatMonthYear(view)}`} className="mt-4 w-full table-fixed border-separate border-spacing-y-1 text-center">
        <thead>
          <tr>
            {WEEKDAYS_SHORT.map((day, index) => (
              <th key={day} scope="col" abbr={WEEKDAYS_LONG[index]} className="pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-(--muted)">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={grid} onKeyDown={onKeyDown}>
          {weeks.map((week) => (
            <tr key={toIso(week[0]!.date)}>
              {week.map(({ date, inMonth }) => {
                const iso = toIso(date);
                if (!inMonth) return <td key={iso} aria-hidden="true" />;
                const past = isBeforeDay(date, today);
                const isSelected = value === iso;
                const isToday = iso === toIso(today);
                return (
                  <td key={iso} className="p-0">
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={iso === focusIso ? 0 : -1}
                      disabled={past}
                      aria-pressed={isSelected}
                      aria-label={`${formatLongDate(date)}${isToday ? ', tänään' : ''}${isSelected ? ', valittu toivepäivä' : ''}`}
                      onClick={() => {
                        setFocusIso(iso);
                        onChange(isSelected ? '' : iso);
                      }}
                      className={cx(
                        'tabular relative mx-auto grid aspect-square w-full max-w-[3.25rem] place-items-center rounded-full text-[0.98rem] transition-colors',
                        past && 'cursor-not-allowed text-(--muted) opacity-40',
                        !past && !isSelected && 'hover:bg-(--fg)/10',
                        isSelected && 'bg-(--fg) font-semibold text-(--bg)',
                        isToday && !isSelected && 'font-semibold ring-1 ring-inset ring-(--accent)',
                      )}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 border-t border-(--line) pt-4 text-[0.84rem] leading-relaxed text-(--muted)">
        Valitset <strong className="font-semibold text-(--fg)">toivepäivän</strong>. Kalenteri ei näytä varaustilannetta – saatavuus vahvistetaan
        tarjouksen yhteydessä.
      </p>
    </div>
  );
}
