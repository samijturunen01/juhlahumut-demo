import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './DatePicker';

const today = new Date(2026, 10, 17); // tiistai 17.11.2026

function Harness() {
  const [value, setValue] = useState('');
  return (
    <>
      <p id="legend">Toivottu päivämäärä</p>
      <DatePicker value={value} onChange={setValue} labelledBy="legend" today={today} />
      <output data-testid="value">{value}</output>
    </>
  );
}

describe('DatePicker', () => {
  it('disables past days and labels today', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: /maanantai 16\. marraskuuta 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /tiistai 17\. marraskuuta 2026, tänään/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Edellinen kuukausi' })).toBeDisabled();
  });

  it('supports keyboard navigation across months', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByRole('button', { name: /tänään/ }).focus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(document.activeElement).toHaveAccessibleName(/tiistai 1\. joulukuuta 2026/);
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('value')).toHaveTextContent('2026-12-01');
    expect(screen.getByText(/joulukuu 2026/)).toBeInTheDocument();
  });

  it('says that it does not show availability', () => {
    render(<Harness />);
    expect(screen.getByText(/ei näytä varaustilannetta/)).toBeInTheDocument();
  });
});
