import React from 'react';
import { render, screen } from '@testing-library/react';

import { api } from '../../api';
import { ArtistEditForm } from './ArtistEditForm';

jest.mock('../../api');
const mockGetArtist = (api.artists.get = jest.fn());

describe('artist edit form functionality', () => {
  test('fetches artist with id passed in props on load and renders edit form with artist data prepopulated', async () => {
    mockGetArtist.mockResolvedValueOnce({ id: 1, name: 'of Montreal', foundedYear: 1996, description: 'The band.' });

    render(<ArtistEditForm artistId={1} />);

    expect(mockGetArtist).toHaveBeenCalledTimes(1);
    expect(mockGetArtist).toHaveBeenCalledWith(1);

    expect(await screen.findByRole('form')).toBeInTheDocument();

    expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('of Montreal'));
    expect(screen.getByLabelText('Year Founded')).toEqual(screen.getByDisplayValue('1996'));
    expect(screen.getByLabelText('Description')).toEqual(screen.getByDisplayValue('The band.'));
  });

  test('renders error message if artist load error occurred', async () => {
    mockGetArtist.mockRejectedValueOnce({ message: 'Artist load failed.' });

    render(<ArtistEditForm artistId={1} />);

    expect(await screen.findByText('Artist load failed.')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});