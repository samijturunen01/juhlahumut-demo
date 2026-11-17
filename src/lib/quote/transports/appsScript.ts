import type { QuoteTransport } from '../types';

/**
 * GOOGLE APPS SCRIPT TRANSPORT – INACTIVE SKELETON.
 *
 * Not used by the demo and not wired to any service. It only shows where a real
 * integration plugs in. Before it can be enabled, all of this must exist
 * (details in docs/BACKEND_INTEGRATION.md):
 *
 *   1. A Google Apps Script web app owned by the company that
 *        - verifies the reCAPTCHA token SERVER-SIDE with the secret key
 *          (the secret lives in Script Properties, never in this repository),
 *        - validates the payload again, drops honeypot hits, rate-limits,
 *        - then e-mails the request to the company.
 *   2. VITE_QUOTE_ENDPOINT        = the web app URL            (public)
 *      VITE_RECAPTCHA_SITE_KEY    = the reCAPTCHA v3 SITE key  (public by design)
 *   3. A privacy notice and consent text approved by the company.
 *
 * Only then set VITE_QUOTE_TRANSPORT=apps-script.
 */
export const appsScriptTransport: QuoteTransport = async () => {
  const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT;
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!endpoint || !siteKey) {
    // Fail closed: without a configured, approved backend nothing may leave the browser.
    return { status: 'error', message: 'Lomakkeen lähetystä ei ole vielä otettu käyttöön. Soita meille, niin autamme.' };
  }

  // Intentionally not implemented in the demo. Outline of the eventual flow:
  //
  //   const token = await grecaptcha.execute(siteKey, { action: 'quote_request' });
  //   const response = await fetch(endpoint, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids a CORS preflight with Apps Script
  //     body: JSON.stringify({ ...request, recaptchaToken: token }),
  //   });
  //   const result = await response.json();
  //   return result.ok ? { status: 'sent' } : { status: 'error', message: '…' };
  //
  return { status: 'error', message: 'Lomakkeen lähetystä ei ole vielä otettu käyttöön. Soita meille, niin autamme.' };
};
