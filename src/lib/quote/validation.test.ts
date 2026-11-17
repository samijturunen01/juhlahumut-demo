import { describe, expect, it } from 'vitest';
import { emptyQuoteRequest, type QuoteRequest } from './types';
import { firstInvalidField, hasErrors, validateQuote } from './validation';

const today = new Date(2026, 10, 17); // 17.11.2026

const valid: QuoteRequest = {
  ...emptyQuoteRequest,
  occasion: 'pikkujoulut',
  date: '2026-12-04',
  guests: '20-30',
  name: 'Maija Meikäläinen',
  email: 'maija@esimerkki.fi',
};

describe('validateQuote', () => {
  it('accepts a complete request', () => {
    expect(validateQuote(valid, today)).toEqual({});
  });

  it('reports every required field of an empty request, in Finnish', () => {
    const errors = validateQuote(emptyQuoteRequest, today);
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'guests', 'name', 'occasion']);
    expect(errors.email).toMatch(/sähköposti/i);
    expect(hasErrors(errors)).toBe(true);
    expect(firstInvalidField(errors)).toBe('occasion');
  });

  it('rejects past dates but accepts today', () => {
    expect(validateQuote({ ...valid, date: '2026-11-16' }, today).date).toMatch(/tänään tai myöhemmin/);
    expect(validateQuote({ ...valid, date: '2026-11-17' }, today).date).toBeUndefined();
  });

  it('rejects impossible dates', () => {
    expect(validateQuote({ ...valid, date: '2027-02-31' }, today).date).toMatch(/kelvollinen/);
  });

  it('validates e-mail format', () => {
    expect(validateQuote({ ...valid, email: 'maija@' }, today).email).toMatch(/Tarkista/);
    expect(validateQuote({ ...valid, email: '  maija@esimerkki.fi  ' }, today).email).toBeUndefined();
  });

  it('treats the phone number as optional but checks it when given', () => {
    expect(validateQuote({ ...valid, phone: '' }, today).phone).toBeUndefined();
    expect(validateQuote({ ...valid, phone: '040 123 4567' }, today).phone).toBeUndefined();
    expect(validateQuote({ ...valid, phone: '+358 40 123 4567' }, today).phone).toBeUndefined();
    expect(validateQuote({ ...valid, phone: 'soita illalla' }, today).phone).toBeDefined();
    expect(validateQuote({ ...valid, phone: '123' }, today).phone).toBeDefined();
  });

  it('requires a name of at least two characters', () => {
    expect(validateQuote({ ...valid, name: ' ' }, today).name).toBeDefined();
    expect(validateQuote({ ...valid, name: 'A' }, today).name).toBeDefined();
  });
});
