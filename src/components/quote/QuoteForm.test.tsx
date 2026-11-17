import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QuoteForm } from './QuoteForm';

const today = new Date(2026, 10, 17);

function setup(query = '') {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[`/tarjouspyynto${query}`]}>
      <QuoteForm today={today} />
    </MemoryRouter>,
  );
  return user;
}

afterEach(() => vi.restoreAllMocks());

describe('QuoteForm', () => {
  it('lists every missing required field in an error summary', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /Lähetä tarjouspyyntö/ }));
    const summary = await screen.findByRole('alert');
    expect(within(summary).getByText(/Tarkista 5 kohtaa/)).toBeInTheDocument();
    expect(within(summary).getAllByRole('link')).toHaveLength(5);
    expect(screen.getByLabelText(/^Sähköposti/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits in demo mode without sending anything and says so plainly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = setup();

    await user.click(screen.getByRole('radio', { name: 'Pikkujoulut' }));
    await user.click(screen.getByRole('button', { name: 'Seuraava kuukausi' }));
    await user.click(screen.getByRole('button', { name: /perjantai 4\. joulukuuta 2026/ }));
    expect(screen.getByText(/Toivepäivä osuu pikkujoulukauteen/)).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /20–30 henkilöä/ }));
    await user.type(screen.getByLabelText(/^Nimi/), 'Maija Meikäläinen');
    await user.type(screen.getByLabelText(/^Sähköposti/), 'maija@esimerkki.fi');
    await user.click(screen.getByRole('button', { name: /Lähetä tarjouspyyntö/ }));

    const heading = await screen.findByRole('heading', { name: 'Demoversio – tarjouspyyntöä ei lähetetty.' }, { timeout: 3000 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/ei lähetetty, tallennettu eikä välitetty/)).toBeInTheDocument();
    expect(screen.queryByText(/varaus on vahvistettu/i)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    // The would-be payload is shown back to the visitor
    expect(screen.getByText('maija@esimerkki.fi')).toBeInTheDocument();
  });

  it('preselects options from the URL', async () => {
    setup('?menu=menu-4&henkilot=yli-30');
    expect(await screen.findByRole('radio', { name: /Yli 30 henkilöä/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /^Kyllä/ })).toBeChecked();
    expect(screen.getByLabelText(/Kiinnostava menu/)).toHaveValue('menu-4');
  });

  it('shows the published example price for the chosen group size, never a total', async () => {
    const user = setup();
    await user.click(screen.getByRole('radio', { name: /Alle 20 henkilöä/ }));
    const summary = screen.getByRole('complementary', { name: /yhteenveto/i });
    expect(within(summary).getByText(/790/)).toBeInTheDocument();
    expect(within(summary).getByText(/Esimerkkihinnat tilavuokrasta/)).toBeInTheDocument();
  });
});
