import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ArtistForm } from './ArtistForm';

describe('artist form validation', () => {
  test('all fields are required', async () => {
    render(<ArtistForm />);

    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Artist name is required.')).toBeInTheDocument();
    expect(await screen.findByText('Founded year must be a number.')).toBeInTheDocument();
    expect(await screen.findByText('Description is required.')).toBeInTheDocument();
  });

  test('year founded must be >= 1850', async () => {
    render(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Year Founded'), '1849');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Year must be on or after 1850.')).toBeInTheDocument();
  });

  test('year founded must be <= current year', async () => {
    const currentYear = (new Date()).getFullYear();

    render(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Year Founded'), String(currentYear + 1));
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText(`Year must be on or earlier than the current year.`)).toBeInTheDocument();
  });
});