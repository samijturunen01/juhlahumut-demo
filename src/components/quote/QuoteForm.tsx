import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowRight, CircleAlert, LoaderCircle, Phone, RotateCcw, X } from 'lucide-react';
import { company } from '@/data/company';
import { menuCategories, menus } from '@/data/menus';
import { occasionOptions } from '@/data/occasions';
import { rentalExample } from '@/data/pricing';
import { formatLongDate, fromIso } from '@/lib/dates';
import { cx, formatEuro } from '@/lib/format';
import { prefillFromParams } from '@/lib/quote/prefill';
import { isDemoTransport, submitQuote } from '@/lib/quote/submit';
import { emptyQuoteRequest, extraOptions, type CateringNeed, type ExtraId, type QuoteErrors, type QuoteField, type QuoteRequest } from '@/lib/quote/types';
import { fieldOrder, hasErrors, validateQuote } from '@/lib/quote/validation';
import { DatePicker } from './DatePicker';
import { Choice, FieldGroup, TextField } from './fields';
import { describeRequest, QuoteSummary } from './QuoteSummary';

type Status = { kind: 'idle' } | { kind: 'pending' } | { kind: 'demo' } | { kind: 'sent' } | { kind: 'error'; message: string };

const fieldLabels: Partial<Record<QuoteField, string>> = {
  occasion: 'Tilaisuuden tyyppi',
  date: 'Toivottu päivämäärä',
  guests: 'Henkilömäärä',
  name: 'Nimi',
  email: 'Sähköposti',
  phone: 'Puhelinnumero',
};

const cateringChoices: { id: CateringNeed; label: string; note: string }[] = [
  { id: 'kylla', label: 'Kyllä', note: 'Ruoat talon cateringista' },
  { id: 'ehka', label: 'Ehkä', note: 'Kerro vaihtoehdoista' },
  { id: 'ei', label: 'Ei tarvetta', note: 'Omat ruoat sopimuksen mukaan' },
];

interface QuoteFormProps {
  /** Injectable "today" for tests. */
  today?: Date;
}

export function QuoteForm({ today }: QuoteFormProps) {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<QuoteRequest>(emptyQuoteRequest);
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Preselect what the visitor was looking at (e.g. ?menu=menu-4). Applied after hydration so the
  // prerendered HTML and the first client render match.
  const paramsKey = searchParams.toString();
  useEffect(() => {
    if (!paramsKey) return;
    const prefill = prefillFromParams(new URLSearchParams(paramsKey));
    setValues((current) => ({ ...current, ...pick(prefill, paramsKey) }));
  }, [paramsKey]);

  const allErrors = useMemo(() => validateQuote(values, today), [values, today]);
  const visibleErrors: QuoteErrors = useMemo(() => {
    if (attempted) return allErrors;
    const shown: QuoteErrors = {};
    for (const key of Object.keys(touched) as QuoteField[]) if (allErrors[key]) shown[key] = allErrors[key];
    return shown;
  }, [allErrors, attempted, touched]);

  const set = <K extends QuoteField>(field: K, value: QuoteRequest[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (status.kind === 'error') setStatus({ kind: 'idle' });
  };
  const touch = (field: QuoteField) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  const toggleExtra = (id: ExtraId, on: boolean) =>
    set('extras', on ? [...values.extras.filter((e) => e !== id), id] : values.extras.filter((e) => e !== id));

  const focusField = (field: QuoteField) => {
    const el = document.getElementById(`field-${field}`);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el.focus({ preventScroll: true });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === 'pending') return;
    const errors = validateQuote(values, today);
    setAttempted(true);
    if (hasErrors(errors)) {
      // Error summary first (it lists every problem as a link), then the visitor fixes them one by one.
      window.requestAnimationFrame(() => {
        summaryRef.current?.focus({ preventScroll: true });
        summaryRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      return;
    }
    setStatus({ kind: 'pending' });
    const result = await submitQuote(values);
    if (result.status === 'error') {
      setStatus({ kind: 'error', message: result.message });
      return;
    }
    setStatus({ kind: result.status });
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      resultRef.current?.focus({ preventScroll: true });
    });
  };

  const reset = () => {
    setValues(emptyQuoteRequest);
    setTouched({});
    setAttempted(false);
    setStatus({ kind: 'idle' });
  };

  const errorList = fieldOrder.filter((f) => visibleErrors[f]);
  const selectedDate = values.date ? fromIso(values.date) : null;

  if (status.kind === 'demo' || status.kind === 'sent') {
    return (
      <div ref={formTopRef} className="scroll-mt-32">
        <DemoResult
          headingRef={resultRef}
          values={values}
          sent={status.kind === 'sent'}
          onEdit={() => setStatus({ kind: 'idle' })}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="grid scroll-mt-32 gap-x-12 gap-y-10 lg:grid-cols-12">
      <form noValidate onSubmit={onSubmit} className="lg:col-span-7 xl:col-span-8" aria-describedby="form-intro">
        <div id="form-intro" className="space-y-3">
          {isDemoTransport && (
            <p className="flex items-start gap-3 rounded-xl border border-rust/35 bg-rust/[0.07] px-4 py-3.5 text-[0.9rem] leading-relaxed">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-rust" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Demotila.</strong> Tämä lomake on osa sivuston konseptidemoa: tietoja ei lähetetä, tallenneta eikä
                välitetä minnekään. Voit kokeilla lomaketta vapaasti.
              </span>
            </p>
          )}
          <p className="text-[0.9rem] text-ash">
            Tähdellä (<span className="text-rust">*</span>) merkityt kohdat ovat pakollisia. Täyttäminen vie noin kaksi minuuttia.
          </p>
        </div>

        {errorList.length > 0 && attempted && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="error-summary-title"
            className="mt-8 rounded-xl border-2 border-[#b3261e] bg-[#b3261e]/[0.05] p-5 outline-none sm:p-6"
          >
            <h2 id="error-summary-title" className="flex items-center gap-2.5 font-sans text-[1.02rem] font-semibold text-[#8f1d17]">
              <CircleAlert aria-hidden="true" className="size-5" />
              Tarkista {errorList.length === 1 ? 'yksi kohta' : `${errorList.length} kohtaa`} ennen lähettämistä
            </h2>
            <ul className="mt-3 space-y-1.5 text-[0.93rem]">
              {errorList.map((field) => (
                <li key={field}>
                  <a
                    href={`#field-${field}`}
                    onClick={(e) => {
                      e.preventDefault();
                      focusField(field);
                    }}
                    className="font-medium text-[#8f1d17] underline underline-offset-3"
                  >
                    {fieldLabels[field]}: {visibleErrors[field]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 01 — Occasion */}
        <FormSection number="01" title="Tilaisuus">
          <FieldGroup name="occasion" legend="Millaista tilaisuutta suunnittelet?" required error={visibleErrors.occasion}>
            <div className="flex flex-wrap gap-2">
              {occasionOptions.map((option) => (
                <Choice
                  key={option.id}
                  type="radio"
                  name="occasion"
                  value={option.id}
                  checked={values.occasion === option.id}
                  onChange={() => {
                    set('occasion', option.id);
                    touch('occasion');
                  }}
                  label={option.label}
                />
              ))}
            </div>
          </FieldGroup>
        </FormSection>

        {/* 02 — Date */}
        <FormSection number="02" title="Ajankohta">
          <FieldGroup
            name="date"
            legend="Toivottu päivämäärä"
            required
            error={visibleErrors.date}
            hint="Valitse päivä kalenterista. Se on toive, ei varaus – saatavuus vahvistetaan tarjouksessa."
          >
            <DatePicker
              value={values.date}
              onChange={(iso) => {
                set('date', iso);
                touch('date');
              }}
              invalid={Boolean(visibleErrors.date)}
              labelledBy="date-legend"
              describedBy={visibleErrors.date ? 'date-hint date-error' : 'date-hint'}
              today={today}
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-h-6 text-[0.95rem]" aria-live="polite">
                {selectedDate ? (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="text-ash">Toivepäivä:</span>
                    <strong className="font-semibold first-letter:uppercase">{formatLongDate(selectedDate)}</strong>
                    <button
                      type="button"
                      onClick={() => set('date', '')}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.82rem] text-ash underline-offset-2 hover:underline"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                      Poista valinta
                    </button>
                  </span>
                ) : (
                  <span className="text-ash">Päivää ei ole vielä valittu.</span>
                )}
              </p>
              <label className="inline-flex cursor-pointer items-center gap-3 text-[0.95rem]">
                <input
                  type="checkbox"
                  checked={values.dateFlexible}
                  onChange={(e) => set('dateFlexible', e.target.checked)}
                  className="size-5 shrink-0 cursor-pointer accent-[#a23e06]"
                />
                Päivä on joustava – myös lähipäivät käyvät
              </label>
            </div>
          </FieldGroup>
        </FormSection>

        {/* 03 — Group and services */}
        <FormSection number="03" title="Seurue ja palvelut">
          <div className="space-y-10">
            <FieldGroup name="guests" legend="Henkilömäärä" required error={visibleErrors.guests} hint="Arvio riittää – tarkka määrä sovitaan myöhemmin.">
              <div className="grid gap-2 sm:grid-cols-3">
                {rentalExample.tiers.map((tier) => (
                  <Choice
                    key={tier.id}
                    type="radio"
                    name="guests"
                    value={tier.id}
                    checked={values.guests === tier.id}
                    onChange={() => {
                      set('guests', tier.id);
                      touch('guests');
                    }}
                    label={tier.label}
                    note={tier.priceInclVat !== null ? `Esimerkkihinta ${formatEuro(tier.priceInclVat)}` : 'Hinta sopimuksen mukaan'}
                    block
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup name="catering" legend="Tarvitsetteko cateringia?">
              <div className="grid gap-2 sm:grid-cols-3">
                {cateringChoices.map((choice) => (
                  <Choice
                    key={choice.id}
                    type="radio"
                    name="catering"
                    value={choice.id}
                    checked={values.catering === choice.id}
                    onChange={() => set('catering', choice.id)}
                    label={choice.label}
                    note={choice.note}
                    block
                  />
                ))}
              </div>
              {values.catering !== 'ei' && (
                <div className="mt-5">
                  <label htmlFor="field-menuId" className="field-label">
                    Kiinnostava menu <span className="ml-1 font-normal text-(--muted)">(vapaaehtoinen)</span>
                  </label>
                  <select id="field-menuId" value={values.menuId} onChange={(e) => set('menuId', e.target.value)} className="field-input appearance-auto">
                    <option value="">Ei vielä valittu</option>
                    {menuCategories.map((cat) => (
                      <optgroup key={cat.id} label={cat.label}>
                        {menus
                          .filter((m) => m.category === cat.id)
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} – {m.kicker} – {m.pricePerPerson} € / hlö
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}
            </FieldGroup>

            <FieldGroup name="extras" legend="Mikä muu kiinnostaa?" hint="Valitse kaikki, jotka haluat mukaan tarjoukseen.">
              <div className="grid gap-2 sm:grid-cols-2">
                {extraOptions.map((option) => (
                  <Choice
                    key={option.id}
                    type="checkbox"
                    name="extras"
                    value={option.id}
                    checked={values.extras.includes(option.id)}
                    onChange={(on) => toggleExtra(option.id, on)}
                    label={option.label}
                    note={option.note}
                    block
                  />
                ))}
              </div>
            </FieldGroup>
          </div>
        </FormSection>

        {/* 04 — Contact */}
        <FormSection number="04" title="Yhteystiedot">
          <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <TextField
              name="name"
              label="Nimi"
              required
              autoComplete="name"
              value={values.name}
              onChange={(v) => set('name', v)}
              onBlur={() => touch('name')}
              error={visibleErrors.name}
              className="sm:col-span-2"
            />
            <TextField
              name="email"
              label="Sähköposti"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(v) => set('email', v)}
              onBlur={() => touch('email')}
              error={visibleErrors.email}
              hint="Tarjous lähetetään tähän osoitteeseen."
            />
            <TextField
              name="phone"
              label="Puhelinnumero"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(v) => set('phone', v)}
              onBlur={() => touch('phone')}
              error={visibleErrors.phone}
              hint="Jos haluat, että sinulle soitetaan."
            />
            <TextField
              name="message"
              label="Lisätiedot"
              multiline
              maxLength={2000}
              value={values.message}
              onChange={(v) => set('message', v)}
              placeholder="Esimerkiksi aikataulu, ruokavaliot tai erityistoiveet"
              className="sm:col-span-2"
            />
          </div>

          {/* Honeypot – hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="field-website">Jätä tämä kenttä tyhjäksi</label>
            <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
          </div>
        </FormSection>

        <div className="mt-12 border-t border-(--line-strong) pt-8">
          {status.kind === 'error' && (
            <p role="alert" className="field-error mb-5 !mt-0 rounded-xl border border-[#b3261e]/40 bg-[#b3261e]/[0.05] p-4">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{status.message}</span>
            </p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="submit" className="btn btn--dark w-full sm:w-auto" aria-disabled={status.kind === 'pending'}>
              {status.kind === 'pending' ? (
                <>
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                  Käsitellään…
                </>
              ) : (
                <>
                  {isDemoTransport ? 'Lähetä tarjouspyyntö (demo)' : 'Lähetä tarjouspyyntö'}
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-[0.85rem] leading-relaxed text-ash sm:max-w-xs">Tarjouspyyntö ei sido mihinkään eikä ole vielä varaus.</p>
          </div>
          <p className="sr-only" aria-live="polite">
            {status.kind === 'pending' ? 'Tarjouspyyntöä käsitellään.' : ''}
          </p>
        </div>
      </form>

      <aside className="lg:col-span-5 xl:col-span-4" aria-label="Tarjouspyynnön yhteenveto">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <QuoteSummary values={values} />
          <p className="mt-5 flex items-center gap-2.5 px-1 text-[0.9rem] text-ash">
            <Phone aria-hidden="true" className="size-4 text-rust" />
            Mieluummin puhelimitse?{' '}
            <a href={company.phone.href} className="prose-link tabular font-semibold text-ink">
              {company.phone.display}
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}

/** Only the fields the URL actually set – so prefill never wipes what the visitor already chose. */
function pick(prefill: QuoteRequest, paramsKey: string): Partial<QuoteRequest> {
  const p = new URLSearchParams(paramsKey);
  const out: Partial<QuoteRequest> = {};
  if (p.has('tilaisuus') && prefill.occasion) out.occasion = prefill.occasion;
  if (p.has('henkilot') && prefill.guests) out.guests = prefill.guests;
  if ((p.has('menu') || p.has('catering')) && prefill.catering !== emptyQuoteRequest.catering) out.catering = prefill.catering;
  if (p.has('menu') && prefill.menuId) out.menuId = prefill.menuId;
  if (p.has('lisapalvelu') && prefill.extras.length) out.extras = prefill.extras;
  if (p.has('paiva') && prefill.date) out.date = prefill.date;
  return out;
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="relative mt-12 border-t border-(--line-strong) pt-8 sm:mt-14" aria-labelledby={`section-${number}`}>
      <div className="mb-7 flex items-baseline gap-4">
        <span className="numeral text-sm text-rust" aria-hidden="true">
          {number}
        </span>
        <h2 id={`section-${number}`} className="font-display text-[1.75rem] leading-none tracking-tight sm:text-[2rem]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function DemoResult({
  headingRef,
  values,
  sent,
  onEdit,
  onReset,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  values: QuoteRequest;
  sent: boolean;
  onEdit: () => void;
  onReset: () => void;
}) {
  const d = describeRequest(values);
  const rows: [string, string | undefined][] = [
    ['Tilaisuus', d.occasion],
    ['Toivepäivä', d.date],
    ['Henkilömäärä', d.guests],
    ['Catering', d.catering],
    ['Kiinnostaa', d.extras],
    ['Nimi', values.name.trim()],
    ['Sähköposti', values.email.trim()],
    ['Puhelin', values.phone.trim() || undefined],
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="theme-night relative overflow-hidden rounded-2xl p-7 sm:p-12">
        <div className="disc-glow -right-1/3 -top-1/3 h-[24rem] w-[40rem] opacity-50" aria-hidden="true" />
        <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ember">{sent ? 'Tarjouspyyntö' : 'Konseptidemo'}</p>
        <h2 ref={headingRef} tabIndex={-1} className="display-md relative mt-4 outline-none">
          {sent ? 'Kiitos – tarjouspyyntösi on vastaanotettu.' : 'Demoversio – tarjouspyyntöä ei lähetetty.'}
        </h2>
        <div className="relative mt-6 space-y-3 text-[1rem] leading-relaxed text-smoke">
          {sent ? (
            <p>Juhlahumut tarkistaa toivepäivän saatavuuden ja palaa asiaan. Varaus vahvistuu vasta, kun päivä ja ehdot on sovittu.</p>
          ) : (
            <>
              <p>
                Tämä on sivuston uudistuskonsepti. Antamiasi tietoja <strong className="font-semibold text-cream">ei lähetetty, tallennettu eikä välitetty</strong>{' '}
                Juhlahumuille, eikä varausta ole tehty.
              </p>
              <p>Valmiilla sivustolla pyyntö välittyisi Juhlahumuille, joka tarkistaisi toivepäivän saatavuuden ja vastaisi tarjouksella.</p>
            </>
          )}
        </div>
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={company.phone.href} className="btn">
            <Phone aria-hidden="true" />
            Soita {company.phone.display}
          </a>
          <button type="button" onClick={onEdit} className="btn btn--ghost">
            Muokkaa tietoja
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-(--line-strong) p-6 sm:p-8">
        <h3 className="font-display text-xl tracking-tight">{sent ? 'Lähetetyt tiedot' : 'Tiedot, jotka olisi lähetetty'}</h3>
        <dl className="mt-4 divide-y divide-(--line) text-[0.93rem]">
          {rows
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-ash">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
        </dl>
        <button type="button" onClick={onReset} className={cx('link-line mt-6 text-[0.92rem]')}>
          <RotateCcw aria-hidden="true" />
          Tyhjennä lomake
        </button>
      </div>
    </div>
  );
}
