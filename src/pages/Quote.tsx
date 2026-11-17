import { QuoteForm } from '@/components/quote/QuoteForm';

export default function Quote() {
  return (
    <>
      <section className="theme-night grain relative isolate overflow-clip" aria-labelledby="quote-title">
        <div className="disc-glow -right-[22vw] top-[10%] -z-10 h-[34vw] w-[90vw] opacity-60 lg:h-[22vw] lg:w-[60vw]" aria-hidden="true" />
        <div className="shell relative z-10 pb-12 pt-[calc(var(--header-h)+3rem)] lg:pb-16 lg:pt-[calc(var(--header-h)+5rem)]">
          <p className="eyebrow" data-reveal="up">
            Tarjouspyyntö
          </p>
          <h1 id="quote-title" className="display-lg mt-6 max-w-[16ch]" data-reveal="up" data-reveal-delay="0.05">
            Kerro juhlistasi, <em>saat tarjouksen.</em>
          </h1>
          <p className="lede mt-7 max-w-[40rem]" data-reveal="up" data-reveal-delay="0.1">
            Valitse toivepäivä, arvioi seurueen koko ja kerro, mitä iltaan kuuluu. Tarjouspyyntö ei sido mihinkään – Juhlahumut tarkistaa saatavuuden ja
            vastaa tarjouksella.
          </p>
        </div>
      </section>

      <section className="theme-paper grain relative" aria-label="Tarjouspyyntölomake">
        <div className="shell section relative z-10 !pt-12 lg:!pt-16">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
