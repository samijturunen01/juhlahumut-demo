import { mockTransport } from './transports/mock';
import type { QuoteRequest, QuoteResult, QuoteTransport } from './types';

/**
 * The single entry point the form calls. Which transport runs is a deployment
 * decision (VITE_QUOTE_TRANSPORT), not something UI components know about.
 *
 * DEMO: the transport is "mock" – nothing is sent, stored or booked.
 * The Apps Script transport exists only as a documented, inactive skeleton
 * (see ./transports/appsScript.ts and docs/BACKEND_INTEGRATION.md) and is loaded
 * lazily, so none of its code ships to visitors while the demo runs on the mock.
 */
async function resolveTransport(): Promise<QuoteTransport> {
  if (import.meta.env.VITE_QUOTE_TRANSPORT === 'apps-script') {
    const { appsScriptTransport } = await import('./transports/appsScript');
    return appsScriptTransport;
  }
  return mockTransport;
}

export async function submitQuote(request: QuoteRequest): Promise<QuoteResult> {
  try {
    const transport = await resolveTransport();
    return await transport(request);
  } catch {
    return { status: 'error', message: 'Lähetys ei onnistunut. Yritä hetken kuluttua uudelleen tai soita meille.' };
  }
}

/** True while the site runs on the mock transport. The UI uses it to label the form honestly. */
export const isDemoTransport = import.meta.env.VITE_QUOTE_TRANSPORT !== 'apps-script';
