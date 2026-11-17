import { menus } from '@/data/menus';
import { occasionOptions } from '@/data/occasions';
import { rentalExample } from '@/data/pricing';
import { fromIso } from '@/lib/dates';
import { emptyQuoteRequest, extraOptions, type ExtraId, type GuestTier, type QuoteRequest } from './types';

/**
 * Builds the form's starting values from the URL, so links elsewhere on the site
 * can pre-select what the visitor was just looking at:
 *
 *   /tarjouspyynto?tilaisuus=pikkujoulut
 *   /tarjouspyynto?henkilot=20-30
 *   /tarjouspyynto?menu=menu-4            (also sets catering to "kyllä")
 *   /tarjouspyynto?lisapalvelu=kylpytynnyri
 *   /tarjouspyynto?paiva=2026-12-12
 *
 * Unknown values are ignored – only options that really exist are accepted.
 */
export function prefillFromParams(params: URLSearchParams): QuoteRequest {
  const request: QuoteRequest = { ...emptyQuoteRequest, extras: [] };

  const occasion = params.get('tilaisuus');
  if (occasion && occasionOptions.some((o) => o.id === occasion)) request.occasion = occasion;

  const guests = params.get('henkilot');
  if (guests && rentalExample.tiers.some((t) => t.id === guests)) request.guests = guests as GuestTier;

  const menu = params.get('menu');
  if (menu && menus.some((m) => m.id === menu)) {
    request.menuId = menu;
    request.catering = 'kylla';
  }

  if (params.get('catering') === 'kylla') request.catering = 'kylla';

  const validExtras = extraOptions.map((e) => e.id as string);
  request.extras = params
    .getAll('lisapalvelu')
    .flatMap((v) => v.split(','))
    .filter((v, i, all): v is ExtraId => validExtras.includes(v) && all.indexOf(v) === i);

  const date = params.get('paiva');
  if (date && fromIso(date)) request.date = date;

  return request;
}
