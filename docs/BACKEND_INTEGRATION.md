# Backend integration (future)

The demo's quote form is **inactive by design**. It runs on a mock transport that sends nothing, stores nothing and creates no reservation. This document describes how to connect a real backend later. Nothing here is enabled.

## Architecture

```
QuoteForm (UI)  ──►  submitQuote()  ──►  transport
src/components/quote   src/lib/quote/submit.ts   ├─ mock        (demo – default)
                                                 └─ appsScript  (inactive skeleton)
```

- UI components never know where a request goes. They call `submitQuote(request)` and render a `QuoteResult` (`demo`, `sent` or `error`).
- `VITE_QUOTE_TRANSPORT` selects the transport at build time. Anything other than `apps-script` uses the mock.
- The Apps Script transport is loaded with a dynamic `import()`, so none of its code ships while the demo runs on the mock.
- `QuoteRequest` (`src/lib/quote/types.ts`) is the payload contract. It includes a honeypot field, `website`, which real visitors never fill in.
- Validation (`src/lib/quote/validation.ts`) is a pure function. The backend should run the same rules again; client-side checks are a convenience, not a guarantee.

## Google Apps Script + reCAPTCHA v3 – recommended setup

1. **Apps Script web app**, owned by the company's Google account:
   - `doPost(e)`: parse `JSON.parse(e.postData.contents)`.
   - **Verify the reCAPTCHA token server-side**: `UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'post', payload: { secret, response: token } })`. Accept only `success === true`, the expected `action` (`quote_request`), a reasonable `score` (for example ≥ 0.5), and the company's hostname.
   - Store the reCAPTCHA **secret key** in *Script Properties* (`PropertiesService.getScriptProperties()`), never in this repository or in any `VITE_*` variable.
   - Validate the payload again, silently drop requests with a non-empty `website` field, and rate-limit (for example with `CacheService`, per e-mail address).
   - Send the request to the company with `MailApp.sendEmail`, and optionally append it to a Google Sheet.
   - Return `ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)`.
   - Deploy as a web app: "Execute as: me", "Who has access: Anyone".
2. **Front end** (public values only – both are safe in client code):
   ```
   VITE_QUOTE_TRANSPORT=apps-script
   VITE_QUOTE_ENDPOINT=https://script.google.com/macros/s/<deployment-id>/exec
   VITE_RECAPTCHA_SITE_KEY=<site key>
   ```
3. Finish `src/lib/quote/transports/appsScript.ts`. The outline is already in the file:
   - load `https://www.google.com/recaptcha/api.js?render=<site key>` only on the quote page, and only after consent if the privacy policy requires it;
   - `grecaptcha.execute(siteKey, { action: 'quote_request' })`;
   - `fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body })`. A `text/plain` body avoids a CORS preflight, which Apps Script cannot answer;
   - map the response to `{ status: 'sent' }` or `{ status: 'error', message }`.
4. **Before going live:** a privacy notice (rekisteriseloste / tietosuojaseloste) approved by the company, a consent line under the form, a reCAPTCHA notice, and an end-to-end test with real e-mail delivery.

The success state already exists. With a real transport the form shows "Kiitos – tarjouspyyntösi on vastaanotettu." and still says that a reservation is confirmed only once the details are agreed.

## Availability calendar (future)

`src/lib/quote/availability.ts` keeps three states separate:

| State | Who decides | In the demo |
| --- | --- | --- |
| Preferred date (toivepäivä) | The visitor | Collected by the date picker |
| Confirmed availability | An authoritative calendar | **Not shown** – the demo has no calendar access |
| Confirmed reservation | Only the company | Never created by the website |

To show availability later, implement `AvailabilityProvider` against the company's calendar. For example, an Apps Script endpoint that reads Google Calendar and returns only `free` / `booked` flags per day, never event details. Mark it `authoritative: true` and pass it to `<DatePicker>`. Even then the form remains a request: the reservation is confirmed by the company.

## Never

- Never put a secret (the reCAPTCHA secret, API keys, SMTP credentials) in a `VITE_*` variable or in the repository. Everything prefixed `VITE_` is compiled into public JavaScript.
- Never let the site claim a booking is confirmed.
- Never enable the real transport on the demo deployment.
