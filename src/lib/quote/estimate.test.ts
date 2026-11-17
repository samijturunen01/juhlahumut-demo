import { describe, expect, it } from 'vitest';
import { estimateFor } from './estimate';

describe('estimateFor', () => {
  it('returns the published example price for the chosen tier', () => {
    expect(estimateFor({ guests: 'alle-20', date: '', extras: [] }).rental?.priceInclVat).toBe(790);
    expect(estimateFor({ guests: '20-30', date: '', extras: [] }).rental?.priceInclVat).toBe(950);
  });

  it('never invents a price for groups over 30', () => {
    expect(estimateFor({ guests: 'yli-30', date: '', extras: [] }).rental?.priceInclVat).toBeNull();
  });

  it('lists only separately priced extras', () => {
    const e = estimateFor({ guests: '', date: '', extras: ['sauna', 'kylpytynnyri'] });
    expect(e.rental).toBeNull();
    expect(e.extras).toEqual([{ label: 'Kylpytynnyri', priceInclVat: 250 }]);
  });

  it('flags the Christmas party season', () => {
    expect(estimateFor({ guests: '', date: '2026-12-05', extras: [] }).christmasSeason).toBe(true);
    expect(estimateFor({ guests: '', date: '2026-11-07', extras: [] }).christmasSeason).toBe(true);
    expect(estimateFor({ guests: '', date: '2027-03-05', extras: [] }).christmasSeason).toBe(false);
  });
});
