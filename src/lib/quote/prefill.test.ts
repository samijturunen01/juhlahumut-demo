import { describe, expect, it } from 'vitest';
import { prefillFromParams } from './prefill';

const p = (query: string) => prefillFromParams(new URLSearchParams(query));

describe('prefillFromParams', () => {
  it('preselects a known occasion and group size', () => {
    const r = p('tilaisuus=pikkujoulut&henkilot=20-30');
    expect(r.occasion).toBe('pikkujoulut');
    expect(r.guests).toBe('20-30');
  });

  it('selecting a menu also answers the catering question', () => {
    const r = p('menu=menu-4');
    expect(r.menuId).toBe('menu-4');
    expect(r.catering).toBe('kylla');
  });

  it('accepts extras as repeated or comma-separated values, without duplicates', () => {
    expect(p('lisapalvelu=kylpytynnyri&lisapalvelu=sauna,kylpytynnyri').extras).toEqual(['kylpytynnyri', 'sauna']);
  });

  it('ignores unknown or malformed values', () => {
    const r = p('tilaisuus=haat-kuussa&henkilot=100&menu=menu-99&lisapalvelu=poreallas&paiva=2026-13-40');
    expect(r.occasion).toBe('');
    expect(r.guests).toBe('');
    expect(r.menuId).toBe('');
    expect(r.extras).toEqual([]);
    expect(r.date).toBe('');
  });

  it('accepts a valid date', () => {
    expect(p('paiva=2026-12-12').date).toBe('2026-12-12');
  });
});
