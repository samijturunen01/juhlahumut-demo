import { expect, test, type Page } from '@playwright/test';

const routes = [
  { path: '', h1: /Juhlat, jotka/ },
  { path: 'juhlatilat', h1: /Kaksi kerrosta/ },
  { path: 'hinnasto', h1: /Tilavuokra/ },
  { path: 'catering', h1: /Juhlapöytä, joka/ },
  { path: 'galleria', h1: /Katso, missä/ },
  { path: 'yhteystiedot', h1: /Tervetuloa/ },
  { path: 'tarjouspyynto', h1: /Kerro juhlistasi/ },
  { path: 'kokoukset', h1: /Kokous, jonka jälkeen/ },
];

/** Skip the one-off homepage intro so tests start from the settled page. */
async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('jh-intro', '1');
    } catch {
      /* storage blocked */
    }
  });
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

async function navigateTo(page: Page, label: string) {
  if (isNarrow(page)) {
    await page.getByRole('button', { name: 'Avaa valikko' }).click();
    await page.getByRole('dialog', { name: 'Valikko' }).getByRole('link', { name: label, exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Päävalikko' }).getByRole('link', { name: label, exact: true }).click();
  }
}

test.describe('every page', () => {
  for (const route of routes) {
    test(`/${route.path} loads directly, hydrates cleanly and fits the screen`, async ({ page }) => {
      await skipIntro(page);
      const errors = collectErrors(page);
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.h1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test('unknown paths return HTTP 404 with the branded page', async ({ page }) => {
    await skipIntro(page);
    const response = await page.goto('tata-sivua-ei-ole');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tämä ovi ei vie/);
    await page.getByRole('link', { name: 'Etusivulle', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Juhlat, jotka/);
  });

  test('every image has alt text', async ({ page }) => {
    await skipIntro(page);
    for (const route of routes) {
      await page.goto(route.path);
      const missing = await page.locator('img:not([alt])').count();
      expect(missing, `/${route.path}`).toBe(0);
    }
  });
});

test.describe('navigation', () => {
  test('client-side navigation, back and forward', async ({ page }) => {
    await skipIntro(page);
    await page.goto('');
    await navigateTo(page, 'Hinnasto');
    await expect(page).toHaveURL(/\/hinnasto$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tilavuokra/);
    await expect(page).toHaveTitle(/Hinnasto/);

    await navigateTo(page, 'Galleria');
    await expect(page).toHaveURL(/\/galleria$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/hinnasto$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tilavuokra/);
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Juhlat, jotka/);
    await page.goForward();
    await expect(page).toHaveURL(/\/hinnasto$/);
  });

  test('refreshing a sub-page keeps it', async ({ page }) => {
    await skipIntro(page);
    await page.goto('catering');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Juhlapöytä, joka/);
  });

  test('mobile menu opens, traps the page behind and closes with Escape', async ({ page }) => {
    test.skip(!isNarrow(page), 'mobile menu only exists below 1024px');
    await skipIntro(page);
    await page.goto('');
    const toggle = page.getByRole('button', { name: 'Avaa valikko' });
    await toggle.click();
    const menu = page.getByRole('dialog', { name: 'Valikko' });
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sulje valikko' })).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.getByRole('link', { name: 'Etusivu', exact: true })).toBeFocused();
    await expect(page.locator('#main')).toHaveAttribute('inert', '');
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Avaa valikko' })).toBeFocused();
  });

  test('skip link moves keyboard focus to the content', async ({ page, browserName }) => {
    test.skip(isNarrow(page) || browserName !== 'chromium');
    await skipIntro(page);
    await page.goto('hinnasto');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Siirry sisältöön' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('homepage intro', () => {
  test('plays once, lands the wordmark in the header and never blocks the page', async ({ page }) => {
    await page.goto('');
    const html = page.locator('html');
    await expect(html).toHaveClass(/intro-pending/);
    // Navigation is usable while the intro runs.
    await expect(page.getByRole('link', { name: /Pyydä tarjous/ }).first()).toBeVisible();
    await expect(html).not.toHaveClass(/intro-pending/, { timeout: 6000 });
    await expect(page.locator('[data-intro="mark"]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Second visit in the same session: no intro.
    await page.reload();
    await expect(html).not.toHaveClass(/intro-pending/);
  });

  test('is skipped entirely with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('');
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/intro-pending/);
    await expect(html).not.toHaveClass(/motion-ok/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Content further down is visible without any scroll animation.
    await expect(page.getByRole('heading', { name: /Koko talo on/ })).toHaveCSS('opacity', '1');
    await context.close();
  });
});

test.describe('gallery', () => {
  test('filters by space and browses photos in the viewer with the keyboard', async ({ page }) => {
    await skipIntro(page);
    await page.goto('galleria');
    await page.getByRole('button', { name: /^Sauna/ }).click();
    await expect(page.getByRole('button', { name: /^Sauna/ })).toHaveAttribute('aria-pressed', 'true');
    const items = page.getByRole('button', { name: /Avaa kuva suurena/ });
    await expect(items).toHaveCount(3);

    await items.first().click();
    const viewer = page.getByRole('dialog');
    await expect(viewer).toBeVisible();
    await expect(viewer).toContainText('01');
    await page.keyboard.press('ArrowRight');
    await expect(viewer.locator('[aria-live="polite"]')).toContainText('02');
    await page.keyboard.press('End');
    await expect(viewer.locator('[aria-live="polite"]')).toContainText('03');
    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
    await expect(items.first()).toBeFocused();
  });

  test('swipes between photos on touch screens', async ({ page }) => {
    test.skip(!test.info().project.use.hasTouch, 'touch screens only');
    await skipIntro(page);
    await page.goto('galleria');
    await page.getByRole('button', { name: /Avaa kuva suurena/ }).first().click();
    const viewer = page.getByRole('dialog');
    const counter = viewer.locator('[aria-live="polite"]');
    await expect(counter).toContainText('01');
    const box = (await viewer.boundingBox())!;
    const y = box.y + box.height / 2;
    await page.dispatchEvent('figure.lightbox-photo', 'pointerdown', { pointerId: 1, pointerType: 'touch', clientX: box.width * 0.8, clientY: y, bubbles: true });
    await page.dispatchEvent('figure.lightbox-photo', 'pointermove', { pointerId: 1, pointerType: 'touch', clientX: box.width * 0.2, clientY: y, bubbles: true });
    await page.dispatchEvent('figure.lightbox-photo', 'pointerup', { pointerId: 1, pointerType: 'touch', clientX: box.width * 0.2, clientY: y, bubbles: true });
    await expect(counter).toContainText('02');
  });
});

test.describe('catering', () => {
  test('switches menu categories and expands menu details', async ({ page }) => {
    await skipIntro(page);
    await page.goto('catering');
    await page.getByRole('tab', { name: /Pikkujoulumenut/ }).click();
    await expect(page.getByRole('tab', { name: /Pikkujoulumenut/ })).toHaveAttribute('aria-selected', 'true');
    const second = page.getByRole('button', { name: /Pikkujoulumenu II/ });
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText('Savuporomoussea')).toBeVisible();
    await page.getByRole('link', { name: 'Pyydä tarjous tällä menulla' }).last().click();
    await expect(page).toHaveURL(/tarjouspyynto\?menu=pikkujoulumenu-2/);
    await expect(page.getByLabel(/Kiinnostava menu/)).toHaveValue('pikkujoulumenu-2');
  });
});

test.describe('quote form', () => {
  test('explains errors, then submits in demo mode without sending anything', async ({ page }) => {
    await skipIntro(page);
    const requests: string[] = [];
    page.on('request', (r) => {
      if (!/\.(js|css|woff2|avif|webp|jpg|png|svg)(\?|$)/.test(r.url()) && r.resourceType() !== 'document') requests.push(r.url());
    });
    await page.goto('tarjouspyynto?tilaisuus=pikkujoulut');
    await expect(page.getByRole('radio', { name: 'Pikkujoulut' })).toBeChecked();

    await page.getByRole('button', { name: /Lähetä tarjouspyyntö/ }).click();
    const summary = page.getByRole('alert');
    await expect(summary).toContainText('Tarkista 4 kohtaa');
    await summary.getByRole('link', { name: /Sähköposti/ }).click();
    await expect(page.locator('#field-email')).toBeFocused();

    // Choose a date with the keyboard: today → one week later
    const today = page.getByRole('button', { name: /tänään/ });
    await today.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByText(/^Toivepäivä:/)).toBeVisible();

    await page.getByText('20–30 henkilöä').click();
    await page.getByLabel(/^Nimi/).fill('Maija Meikäläinen');
    await page.getByLabel(/^Sähköposti/).fill('maija@esimerkki.fi');
    await page.getByRole('button', { name: /Lähetä tarjouspyyntö/ }).click();

    await expect(page.getByRole('heading', { name: 'Demoversio – tarjouspyyntöä ei lähetetty.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Demoversio – tarjouspyyntöä ei lähetetty.' })).toBeFocused();
    expect(requests).toEqual([]);
  });
});
