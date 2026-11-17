import type { QuoteTransport } from '../types';

/**
 * MOCK TRANSPORT – DEMO ONLY.
 *
 * Deliberately does nothing with the request: no network call, no e-mail,
 * no storage (not even localStorage), no logging of personal data.
 * It waits briefly so the pending state of the form can be seen, then reports
 * "demo" so the UI can say plainly that nothing was sent.
 */
export const mockTransport: QuoteTransport = async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { status: 'demo' };
};
