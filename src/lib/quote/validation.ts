import { fromIso, isBeforeDay, startOfDay } from '@/lib/dates';
import type { QuoteErrors, QuoteField, QuoteRequest } from './types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Order in which fields appear in the form – used to focus the first invalid one. */
export const fieldOrder: QuoteField[] = ['occasion', 'date', 'guests', 'name', 'email', 'phone'];

/**
 * Validates a quote request. Messages are written for the visitor: they say what
 * is missing and how to fix it. `today` is injectable so the rule "not in the
 * past" can be tested deterministically.
 */
export function validateQuote(request: QuoteRequest, today: Date = new Date()): QuoteErrors {
  const errors: QuoteErrors = {};

  if (!request.occasion) errors.occasion = 'Valitse tilaisuuden tyyppi.';

  if (!request.date) {
    errors.date = 'Valitse toivomasi päivä kalenterista.';
  } else {
    const date = fromIso(request.date);
    if (!date) errors.date = 'Päivämäärä ei ole kelvollinen. Valitse päivä kalenterista.';
    else if (isBeforeDay(date, startOfDay(today))) errors.date = 'Valitse päivä, joka on tänään tai myöhemmin.';
  }

  if (!request.guests) errors.guests = 'Valitse arvio henkilömäärästä.';

  const name = request.name.trim();
  if (!name) errors.name = 'Kirjoita nimesi.';
  else if (name.length < 2) errors.name = 'Nimen tulee olla vähintään kaksi merkkiä.';

  const email = request.email.trim();
  if (!email) errors.email = 'Kirjoita sähköpostiosoitteesi, jotta tarjous voidaan lähettää.';
  else if (!EMAIL.test(email)) errors.email = 'Tarkista sähköpostiosoite – esimerkiksi nimi@esimerkki.fi.';

  const phone = request.phone.trim();
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (!/^[+\d][\d\s()-]*$/.test(phone) || digits.length < 6 || digits.length > 15) {
      errors.phone = 'Tarkista puhelinnumero – esimerkiksi 040 123 4567.';
    }
  }

  return errors;
}

export const hasErrors = (errors: QuoteErrors): boolean => Object.keys(errors).length > 0;

export const firstInvalidField = (errors: QuoteErrors): QuoteField | undefined => fieldOrder.find((f) => errors[f]);
