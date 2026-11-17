import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { App } from './App';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routes', () => {
  it.each([
    ['/', /Juhlat, jotka/],
    ['/juhlatilat', /Kaksi kerrosta/],
    ['/hinnasto', /Tilavuokra/],
    ['/catering', /Juhlapöytä, joka/],
    ['/galleria', /Katso, missä/],
    ['/yhteystiedot', /Tervetuloa/],
    ['/tarjouspyynto', /Kerro juhlistasi/],
    ['/kokoukset', /Kokous, jonka jälkeen/],
  ])('%s renders its page with exactly one h1', (path, heading) => {
    renderAt(path);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(heading);
    expect(screen.getByRole('navigation', { name: 'Päävalikko' })).toBeInTheDocument();
  });

  it('shows the branded 404 for unknown paths', () => {
    renderAt('/ei-tallaista-sivua');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Tämä ovi ei vie/);
    expect(screen.getByRole('link', { name: 'Etusivulle' })).toBeInTheDocument();
  });

  it('always identifies the site as a concept demo', () => {
    renderAt('/');
    expect(screen.getAllByText(/Konseptidemo/).length).toBeGreaterThan(0);
  });
});
