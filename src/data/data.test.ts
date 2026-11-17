import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { company } from './company';
import { galleryItems } from './gallery';
import { imageManifest } from './images.generated';
import { cateringNotes, menus } from './menus';
import { occasions } from './occasions';
import { extras, rentalExample, rentalTerms } from './pricing';
import { pages, prerenderPaths } from './site';
import { spaces } from './venue';

/**
 * Guards the facts transcribed from juhlahumut.fi. If one of these fails, the
 * content changed – re-verify against the source before updating the test.
 */
describe('verified company facts', () => {
  it('contact details', () => {
    expect(company.phone.display).toBe('0400 304 944');
    expect(company.phone.href).toBe('tel:+358400304944');
    expect(company.address.street).toBe('Aspitie 33');
    expect(company.address.city).toBe('Joensuu');
    // Not published by the company – must never be guessed.
    expect(company.email).toBeNull();
    expect(company.openingHours).toBeNull();
    expect(company.address.postalCode).toBeNull();
  });

  it('example rental prices and their scope', () => {
    expect(rentalExample.tiers.map((t) => t.priceInclVat)).toEqual([790, 950, null]);
    expect(rentalExample.tiers.map((t) => t.priceExclVat)).toEqual([629.48, 756.97, null]);
    expect(rentalExample.conditions).toMatch(/16–24/);
    expect(rentalExample.conditions).toMatch(/marras/);
  });

  it('hot tub and cancellation terms', () => {
    expect(extras.find((e) => e.id === 'kylpytynnyri')?.priceInclVat).toBe(250);
    expect(rentalTerms.cancellation.freeUntilDays).toBe(30);
    expect(rentalTerms.cancellation.lateFee).toBe(500);
  });

  it('menu prices per person', () => {
    expect(Object.fromEntries(menus.map((m) => [m.id, m.pricePerPerson]))).toEqual({
      'menu-1': 33,
      'menu-2': 35,
      'menu-3': 30,
      'menu-4': 40,
      'menu-5': 35,
      'pikkujoulumenu-1': 42,
      'pikkujoulumenu-2': 45,
    });
  });

  it('never repeats the outdated 14 % VAT wording', () => {
    const source = readFileSync(path.join(__dirname, 'menus.ts'), 'utf8');
    const userFacing = JSON.stringify({ menus, cateringNotes });
    expect(userFacing).not.toMatch(/14\s*%/);
    expect(source).toMatch(/outdated/); // the reason is documented next to the data
  });
});

describe('content integrity', () => {
  const slugs = new Set(Object.keys(imageManifest));

  it('every referenced photograph exists', () => {
    const referenced = [
      ...galleryItems.map((g) => g.slug),
      ...occasions.map((o) => o.image),
      ...spaces.flatMap((s) => s.photos.map((p) => p.slug)),
    ];
    for (const slug of referenced) expect(slugs.has(slug), slug).toBe(true);
  });

  it('the gallery shows each original photograph exactly once, with alt text', () => {
    const gallerySlugs = galleryItems.map((g) => g.slug);
    expect(new Set(gallerySlugs).size).toBe(gallerySlugs.length);
    expect(gallerySlugs).toHaveLength(19);
    for (const item of galleryItems) expect(item.alt.length).toBeGreaterThan(8);
  });

  it('every page has a unique title and a description of sensible length', () => {
    const all = Object.values(pages);
    expect(new Set(all.map((p) => p.title)).size).toBe(all.length);
    for (const page of all) {
      expect(page.description.length, page.path).toBeGreaterThan(40);
      expect(page.description.length, page.path).toBeLessThanOrEqual(170);
    }
    expect(prerenderPaths).not.toContain('/404');
  });
});
