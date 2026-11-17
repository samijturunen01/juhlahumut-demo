# Content verification

All business facts on the demo were transcribed from the company's current website, **juhlahumut.fi**, as published on 16.11.2026 (pages: Etusivu, Menu, Hinnasto, Kokous, Yhteystiedot, and the gallery). The data lives in `src/data/` and is guarded by `src/data/data.test.ts`, which fails if a verified figure changes.

Nothing was invented: no reviews, staff names, opening hours, e-mail address, availability or prices that the company has not published.

## Verified facts

| Fact | Value used | Source on juhlahumut.fi |
| --- | --- | --- |
| Business | Juhlahumut – juhlatila, saunatila, kokoustila ja catering, Joensuu | Every page (header text) |
| Address | Aspitie 33, Joensuu | Every page (footer "Soita ja varaa!") |
| Phone | 0400 304 944 | Every page |
| Social | Instagram and TikTok, both @juhlahumut | Footer links |
| Video | YouTube `vRlLUoUFk_c` | Embedded on the home page |
| Capacity | "noin 10–50 henkilölle" (also "noin 50 hengelle") | Etusivu, header text |
| Floors | Two: downstairs dining and social spaces + sauna section; upstairs games room | Etusivu |
| Games | Biljardipöytä, ilmakiekko, voima- ja nopeuspelit, flipperi, darts, pelikonsoli | Etusivu, header text |
| Sound | Quality sound system, can be connected e.g. to Spotify; music from own phones via Bluetooth | Etusivu, header text |
| Sauna | Mood-lit sauna with a television; access to an outdoor terrace; hot tub possible | Header text |
| Fireplace | Open fireplace in the dining hall | Header text |
| Own drinks | "Tilaisuus on aina yksityinen, joten omat alkoholijuomat ovat sallittuja." | Etusivu, Hinnasto |
| Own food | "Omat ruoat sopimuksen mukaan." | Hinnasto |
| Occasions | juhlat, pikkujoulut, virkistyspäivät, polttarit, saunaillat, häät, työpaikan pikkujoulut, peli-ilta | Header text (SEO paragraph) |
| Meetings | Weekdays, about 20 people; projector, sound system, Wi-Fi, 75″ TV; staff can arrange coffee and lunch | Kokous |

### Pricing (Hinnasto)

| Item | Published wording | Shown as |
| --- | --- | --- |
| Scope of examples | "Esimerkkihinnat tilavuokrasta klo 16 – 24 väliselle ajalle pikkujoulukauden ulkopuolella (pl. marras-, joulukuu viikonloput)" | Always printed next to the prices; the UI never shows a price without it |
| Under 20 people | 790 € (629,48 € alv 0 %) | 790 € sis. alv · 629,48 € alv 0 % |
| 20–30 people | 950 € (756,97 € alv 0 %) | 950 € sis. alv · 756,97 € alv 0 % |
| Over 30 people | sopimuksen mukaan | "Sopimuksen mukaan" |
| Other times | "Muuna aikana sopimuksen mukaan." | Printed with the examples |
| Included | Sauna; pyyhkeet, pesuaineet; pelikoneet; lasit (viini-, kuohuviini-, konjakki-, juomalasit, tuopit); astiat, kahviastiasto, tarjoilukulhot **kun tilaukseen kuuluu ruoat**; kylmäkaapit; jääpalakone; henkilökunta; 20 parkkipaikkaa pihassa; tavanomainen loppusiivous | Listed in the same order; the conditional item is visibly marked |
| Hot tub | 10–12 people, 5 hours, pre-heated, 250 € | 250 € sis. alv |
| Cancellation | Free until 30 days before; later cancellations: 500 € reservation fee | Shown verbatim and as a two-state comparison |

The quote form never calculates a total. It only looks up these published example prices and repeats their conditions.

### Catering (Menu)

Seven menus with per-person prices: Menu 1 33 €, Menu 2 35 €, Menu 3 30 €, Menu 4 40 €, Menu 5 35 € (charcoal grill, May–September), Pikkujoulumenu I 42 €, Pikkujoulumenu II 45 €. Every dish, its order and its dietary codes (M, L, VL, G) follow the source. Also published: dessert examples, evening snack options, "Kaikki tuotteet ovat laktoosittomia ja tilauksesta myös gluteenittomana", "Jälkiruuat sopimuksen mukaan", and the general catering description (local produce, game and fish).

## Corrections made (spelling only)

Obvious typing slips in the menu were corrected. Nothing was added, removed, renamed or re-priced.

| Source text | Shown as |
| --- | --- |
| kurpitsan siementä | kurpitsansiementä |
| Perinteistä Joulukinkkua | Perinteistä joulukinkkua |
| Kahvi / Tee, Kahvi/tee | Kahvi / tee |
| paahdetta perunasalaattia | paahdettua perunasalaattia |
| créme fraiche, Créme Fraichea | crème fraîche, crème fraîchea |
| tuotejuustoa | tuorejuustoa |
| Vihersalaatti ja salaatinkastiketta (Menu 2) | Vihersalaattia ja salaatinkastiketta |
| (pepperoni- mozzarella- tomaatti) | (pepperoni, mozzarella, tomaatti) |
| Broileri-ceasarsalaattia | Broileri-caesarsalaattia |
| sitrusvinaigretteä | sitrusvinaigrettea |
| ruohosipuli créme fraichea | ruohosipuli-crème fraîchea |
| Porsaanfilepihvit ja / tai | Porsaanfileepihvit ja/tai |

The two Christmas menus are listed one dish per line in the source. The demo groups them visually at natural points (salads, cold dishes, mains, pastries, coffee). The original order is kept, and the groups are not given names the source does not use.

## Flagged for the owner – needs confirmation before production

1. **Catering VAT wording is outdated.** The menu page says "Hinnat / hlö, sis. alv 14 %". That rate is no longer current, so the demo does **not** repeat it and does not invent new tax-inclusive amounts. It says only: "Hinnat ovat henkilöä kohden. Lopullinen hinta ja arvonlisävero vahvistetaan tarjouksessa." The owner should confirm the current VAT-inclusive menu prices.
2. **Hot tub VAT-free price.** "250 € (201,61 € alv 0 %)" implies the older 24 % rate, while the rental prices (790 / 629,48) match 25.5 %. The demo shows only the VAT-inclusive 250 €. Confirm the VAT-free figure.
3. **Christmas-season weekends.** Pricing for November–December weekends is not published. The demo says these are agreed separately.
4. **No e-mail address** is published, so none is shown. The quote form (demo) and the phone number are the contact channels. Add an address if the company wants one.
5. **No postal code** is published. The address is shown as "Aspitie 33, Joensuu", and structured data omits the postal code.
6. **No opening hours** are published. The venue is rented by reservation, and the site says only that.
7. **Booking process.** The four-step "Näin se etenee" sequence is a general illustration, and is labelled as such on the page. The company's actual reservation procedure (deposit, contract, confirmation) should be written in.
8. **Evening timeline.** The homepage "Illan kaari" times (16:00 → 22:00) illustrate the published 16–24 example window. They are labelled as illustration, not a programme.
9. **Occasions.** The occasions list comes from the company's own wording. "Häät" appears there only as "juhlapaikka, jossa järjestää polttarit tai häät". Confirm the company wants to promote weddings.
10. **Upstairs "pelipöytä" (touch-screen table)** appears in the company's photos but is not named in the text. It is shown in the gallery with a neutral caption only.
11. **Dessert and evening-snack prices** are not published. They are shown as "sopimuksen mukaan".
12. **Logo usage** – resolved: permission to publish the authentic logo was confirmed on 17.11.2026 and the demo uses it (see `ASSET_PROVENANCE.md`).

## Demo safeguards

- The site is marked as a concept demo in the header (on every page), in the footer and on the quote form.
- `noindex,nofollow` on every page. No canonical URL and no sitemap point at the company's domain.
- The quote form runs on a mock transport: no network request, no storage, and the result says "Demoversio – tarjouspyyntöä ei lähetetty."
