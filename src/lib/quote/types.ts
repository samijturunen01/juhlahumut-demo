import type { RentalTier } from '@/data/pricing';

export type GuestTier = RentalTier['id'];
export type CateringNeed = 'kylla' | 'ei' | 'ehka';

export const extraOptions = [
  { id: 'sauna', label: 'Sauna', note: 'Sisältyy tilavuokraan' },
  { id: 'pelitila', label: 'Pelitila', note: 'Sisältyy tilavuokraan' },
  { id: 'kylpytynnyri', label: 'Kylpytynnyri', note: 'Lisäpalvelu 250 €' },
  { id: 'kokoustekniikka', label: 'Esitystekniikka', note: 'Videotykki ja 75″ televisio' },
] as const;

export type ExtraId = (typeof extraOptions)[number]['id'];

/** Everything the visitor tells us. This is also the payload a future backend would receive. */
export interface QuoteRequest {
  occasion: string;
  /** Preferred date, local calendar day "YYYY-MM-DD". A wish – never a confirmed booking. */
  date: string;
  dateFlexible: boolean;
  guests: GuestTier | '';
  catering: CateringNeed;
  menuId: string;
  extras: ExtraId[];
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Honeypot. Real visitors never fill it; a future backend should silently drop requests that do. */
  website: string;
}

export const emptyQuoteRequest: QuoteRequest = {
  occasion: '',
  date: '',
  dateFlexible: false,
  guests: '',
  catering: 'ehka',
  menuId: '',
  extras: [],
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '',
};

export type QuoteField = keyof QuoteRequest;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/**
 * Outcome of a submission.
 *  - "demo": the mock transport ran. Nothing was sent, stored or booked.
 *  - "sent": a real backend accepted the request (not used in the demo).
 *  - "error": the transport failed; `message` is safe to show to the visitor.
 */
export type QuoteResult = { status: 'demo' } | { status: 'sent' } | { status: 'error'; message: string };

/** A transport delivers a validated request somewhere. The UI never knows where. */
export type QuoteTransport = (request: QuoteRequest) => Promise<QuoteResult>;
