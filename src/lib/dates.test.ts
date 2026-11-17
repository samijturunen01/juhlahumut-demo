import { describe, expect, it } from 'vitest';
import { formatLongDate, fromIso, monthGrid, toIso, weekdayIndex } from './dates';

describe('dates', () => {
  it('round-trips local calendar days', () => {
    expect(toIso(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toIso(fromIso('2026-12-31')!)).toBe('2026-12-31');
  });

  it('rejects overflowing dates', () => {
    expect(fromIso('2026-02-29')).toBeNull();
    expect(fromIso('2028-02-29')).not.toBeNull();
    expect(fromIso('12.12.2026')).toBeNull();
  });

  it('builds Monday-first month grids of whole weeks', () => {
    const grid = monthGrid(2026, 10); // November 2026 starts on a Sunday
    expect(grid.every((week) => week.length === 7)).toBe(true);
    expect(weekdayIndex(grid[0]![0]!.date)).toBe(0);
    expect(grid.flat().filter((d) => d.inMonth)).toHaveLength(30);
    expect(toIso(grid[0]![6]!.date)).toBe('2026-11-01');
  });

  it('formats dates in Finnish', () => {
    expect(formatLongDate(new Date(2026, 11, 12))).toMatch(/lauantai 12\. joulukuuta 2026/);
  });
});
