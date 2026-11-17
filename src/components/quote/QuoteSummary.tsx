import { CalendarCheck, CalendarHeart, CalendarSearch } from 'lucide-react';
import { getMenu } from '@/data/menus';
import { occasionOptions } from '@/data/occasions';
import { rentalExample } from '@/data/pricing';
import { formatLongDate, fromIso } from '@/lib/dates';
import { formatEuro } from '@/lib/format';
import { estimateFor } from '@/lib/quote/estimate';
import { extraOptions, type QuoteRequest } from '@/lib/quote/types';

const cateringLabels: Record<QuoteRequest['catering'], string> = {
  kylla: 'Kyllä',
  ehka: 'Ehkä – haluan kuulla vaihtoehdoista',
  ei: 'Ei tarvetta',
};

export function describeRequest(values: QuoteRequest) {
  const date = values.date ? fromIso(values.date) : null;
  const menu = values.menuId ? getMenu(values.menuId) : undefined;
  return {
    occasion: occasionOptions.find((o) => o.id === values.occasion)?.label,
    date: date ? `${formatLongDate(date)}${values.dateFlexible ? ' (joustava)' : ''}` : undefined,
    guests: rentalExample.tiers.find((t) => t.id === values.guests)?.label,
    catering: values.catering !== 'ei' && menu ? `${cateringLabels[values.catering]}: ${menu.name}, ${menu.pricePerPerson} € / hlö` : cateringLabels[values.catering],
    extras: values.extras.length ? values.extras.map((id) => extraOptions.find((e) => e.id === id)?.label).filter(Boolean).join(', ') : undefined,
  };
}

/**
 * Live summary next to the form. Shows only the company's PUBLISHED example prices
 * for what has been chosen – never a calculated total – and keeps the three
 * states (wish / availability / reservation) visibly apart.
 */
export function QuoteSummary({ values }: { values: QuoteRequest }) {
  const d = describeRequest(values);
  const estimate = estimateFor(values);
  const rows: [string, string | undefined][] = [
    ['Tilaisuus', d.occasion],
    ['Toivepäivä', d.date],
    ['Henkilömäärä', d.guests],
    ['Catering', d.catering],
    ['Kiinnostaa', d.extras],
  ];

  return (
    <div className="theme-night overflow-hidden rounded-2xl">
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-[1.6rem] leading-tight tracking-tight">Yhteenveto</h2>
        <dl className="mt-5 divide-y divide-cream/10 border-y border-cream/10 text-[0.92rem]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-3">
              <dt className="text-smoke">{label}</dt>
              <dd className={value ? 'text-cream' : 'text-cream/35'}>{value ?? '–'}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6" aria-live="polite">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ember">Esimerkkihinta</p>
          {estimate.rental ? (
            estimate.rental.priceInclVat !== null ? (
              <p className="mt-2">
                <span className="numeral text-5xl leading-none">{formatEuro(estimate.rental.priceInclVat)}</span>
                <span className="ml-2 text-[0.85rem] text-smoke">tilavuokra, sis. alv</span>
              </p>
            ) : (
              <p className="mt-2 font-display text-2xl italic">Sopimuksen mukaan</p>
            )
          ) : (
            <p className="mt-2 text-[0.92rem] text-smoke">Valitse henkilömäärä, niin näet julkaistun esimerkkihinnan.</p>
          )}
          {estimate.extras.map((extra) => (
            <p key={extra.label} className="mt-2 text-[0.92rem]">
              + {extra.label} <span className="numeral">{formatEuro(extra.priceInclVat)}</span>
            </p>
          ))}
          <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
            {rentalExample.conditions} {rentalExample.otherTimes}
          </p>
          {estimate.christmasSeason && (
            <p className="mt-3 rounded-lg border border-ember/40 bg-ember/10 px-3 py-2.5 text-[0.82rem] leading-relaxed text-glow">
              Toivepäivä osuu pikkujoulukauteen: marras- ja joulukuun viikonloppujen hinta sovitaan erikseen.
            </p>
          )}
        </div>
      </div>

      <ol className="grid border-t border-cream/10 bg-soot/60 text-[0.8rem] leading-snug" aria-label="Toiveesta varaukseen">
        <li className="flex gap-3 border-b border-cream/10 px-6 py-3.5 sm:px-8">
          <CalendarHeart aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ember" />
          <span>
            <strong className="font-semibold text-cream">Toivepäivä</strong> <span className="text-smoke">– sinä valitset sen tällä lomakkeella.</span>
          </span>
        </li>
        <li className="flex gap-3 border-b border-cream/10 px-6 py-3.5 sm:px-8">
          <CalendarSearch aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-smoke" />
          <span>
            <strong className="font-semibold text-cream">Saatavuus</strong> <span className="text-smoke">– Juhlahumut tarkistaa ja kertoo sen tarjouksessa.</span>
          </span>
        </li>
        <li className="flex gap-3 px-6 py-3.5 sm:px-8">
          <CalendarCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-smoke" />
          <span>
            <strong className="font-semibold text-cream">Varaus</strong> <span className="text-smoke">– vahvistuu vasta, kun päivä ja ehdot on sovittu yhdessä.</span>
          </span>
        </li>
      </ol>
    </div>
  );
}
