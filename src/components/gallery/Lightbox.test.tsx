import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Lightbox, type LightboxItem } from './Lightbox';

const items: LightboxItem[] = [
  { slug: 'sauna', alt: 'Sauna', caption: 'Tunnelmavalaistu sauna' },
  { slug: 'biljardi', alt: 'Biljardi', caption: 'Biljardi' },
  { slug: 'ilmakiekko', alt: 'Ilmakiekko', caption: 'Ilmakiekko' },
];

function Harness() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <button type="button" onClick={() => setIndex(0)}>
        Avaa
      </button>
      <Lightbox items={items} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} label="Galleria" />
    </>
  );
}

describe('Lightbox', () => {
  it('opens as a modal dialog, browses with arrow keys and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Avaa' }));

    const dialog = screen.getByRole('dialog', { name: 'Galleria' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('img', { name: 'Sauna' })).toBeInTheDocument();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('img', { name: 'Biljardi' })).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('img', { name: 'Ilmakiekko' })).toBeInTheDocument();
    await user.keyboard('{Home}');
    expect(screen.getByRole('img', { name: 'Sauna' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
