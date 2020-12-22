import React from 'react';
import { render, screen } from '@testing-library/react';

import { ArtistPage } from './ArtistPage';
import { api } from '../../api';

jest.mock('../../api');
const mockGetArtist = (api.artists.get = jest.fn());
const mockListSongs = (api.songs.list = jest.fn());

describe('artist page functionality', () => {
  test('should fetch artist with given id on load and render their information', async () => {
    mockGetArtist.mockResolvedValueOnce({ 
      id: 1,
      name: 'Chuck Person',
      foundedYear: 2011,
      description: 'AKA Oneohtrix Point Never'
    });

    render(<ArtistPage artistId={1} />);

    expect(mockGetArtist).toHaveBeenCalledTimes(1);
    expect(mockGetArtist).toHaveBeenCalledWith(1);

    const artistHeading = await screen.findByRole('heading');
    expect(artistHeading).toBeInTheDocument();
    expect(artistHeading.textContent).toEqual('Chuck Person');
    expect(screen.getByText('Founded: 2011')).toBeInTheDocument();
    expect(screen.getByText('AKA Oneohtrix Point Never')).toBeInTheDocument();
  });

  test('should render error message on error', async () => {
    mockGetArtist.mockRejectedValueOnce({ message: 'Artist failed to load.' });

    render(<ArtistPage artistId={666} />);

    expect(mockGetArtist).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Artist failed to load.')).toBeInTheDocument();
  });
});