import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';

import { ArtistPage } from './ArtistPage';
import { api } from '../../api';
import { PlayerContext } from '../player/PlayerProvider';
import { createMemoryHistory } from 'history';

jest.mock('../../api');
const mockGetArtist = (api.artists.get = jest.fn());
const mockListSongs = (api.songs.list = jest.fn());

const mockSetQueue = jest.fn();

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(
    <PlayerContext.Provider value={{ setQueue: mockSetQueue }}>
      <Router history={history}>
        {ui}
      </Router>
    </PlayerContext.Provider>
  );
};

const artistResponse = {
  id: 1,
  name: 'Chuck Person',
  foundedYear: 2011,
  description: 'AKA Oneohtrix Point Never'
};

const songsResponse = [
    {
      "id": 3,
      "name": "Save a Secret for the Moon",
      "year": 1996,
      "artist": {
          "id": 2,
          "name": "The Magnetic Fields",
      },
      "sources": [
          {
              "id": 3,
              "url": "https://www.youtube.com/watch?v=4rk_9cYOp8A",
              "service": "YouTube",
              "is_primary": true,
              "song": 3
          }
      ],
      "avg_rating": 4.5
  },
  {
      "id": 4,
      "name": "You and Me and the Moon",
      "year": 1996,
      "artist": {
          "id": 2,
          "name": "The Magnetic Fields",
      },
      "sources": [
          {
              "id": 4,
              "url": "https://www.youtube.com/watch?v=r1aLwEQc6LM",
              "service": "YouTube",
              "is_primary": true,
              "song": 4
          }
      ],
      "avg_rating": null
  }
];

describe('artist page functionality', () => {
  test('should fetch artist with given id on load and render their information', async () => {
    mockGetArtist.mockResolvedValueOnce(artistResponse);

    renderComponent(<ArtistPage artistId={1} />);

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

    renderComponent(<ArtistPage artistId={666} />);

    expect(mockGetArtist).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Artist failed to load.')).toBeInTheDocument();
  });

  test('updates queue with songs when play button clicked', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    renderComponent(<ArtistPage artistId={1} />);

    expect(mockListSongs).toHaveBeenCalledTimes(1);

    const playButton = await screen.findByText('Play all Chuck Person songs');
    await userEvent.click(playButton);

    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenCalledWith(songsResponse);
  });
});