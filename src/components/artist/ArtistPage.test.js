import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';

import { ArtistPage } from './ArtistPage';
import { api } from '../../api';
import { PlayerContext } from '../player/PlayerProvider';
import { UserContext } from '../user/UserProvider';
import { createMemoryHistory } from 'history';

jest.mock('../../api');
const mockGetArtist = (api.artists.get = jest.fn());
const mockDeleteArtist = (api.artists.delete = jest.fn());
const mockListSongs = (api.songs.list = jest.fn());

const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const renderComponentAsUser = (ui, userId) => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ user: { id: userId }}}>
      <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
        <Router history={history}>
          {ui}
        </Router>
      </PlayerContext.Provider>
    </UserContext.Provider>
  );

  return history;
};

const artistResponse = {
  id: 1,
  name: 'Chuck Person',
  foundedYear: 2011,
  description: 'AKA Oneohtrix Point Never',
  creator: {
    id: 1
  }
};

const songsResponse = {
  count: 2,
  data: [
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
  ]
};

describe('artist page functionality', () => {
  test('should fetch artist with given id on load and render their information', async () => {
    mockGetArtist.mockResolvedValueOnce(artistResponse);

    renderComponentAsUser(<ArtistPage artistId={1} />, 1);

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

    renderComponentAsUser(<ArtistPage artistId={666} />, 1);

    expect(mockGetArtist).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Artist failed to load.')).toBeInTheDocument();
  });

  test('updates queue with songs when play button clicked', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    renderComponentAsUser(<ArtistPage artistId={1} />, 1);

    expect(mockListSongs).toHaveBeenCalledTimes(1);

    const playButton = await screen.findByText('Play all Chuck Person songs');
    userEvent.click(playButton);

    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenCalledWith(songsResponse.data);

    expect(mockPlayQueue).toHaveBeenCalledTimes(1);
  });

  test('renders edit and delete controls when user is creator of artist', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    await waitFor(() => renderComponentAsUser(<ArtistPage artistId={1} />, 1));

    expect(screen.getByText('edit')).toBeInTheDocument();
    expect(screen.getByText('Delete Artist')).toBeInTheDocument();
  });

  test('does not render edit or delete controls when user is not creator of artist', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    await waitFor(() => renderComponentAsUser(<ArtistPage artistId={1} />, 2));

    expect(screen.queryByText('edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Artist')).not.toBeInTheDocument();
  });

  test('edit links to artist edit page', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    let history;

    await waitFor(() => history = renderComponentAsUser(<ArtistPage artistId={1} />, 1));

    userEvent.click(screen.getByText('edit'));
    expect(history.location.pathname).toEqual('/artists/1/edit');
  });

  test('confirming delete on artist will call delete artist api function and redirect to /', async () => {
    mockGetArtist.mockResolvedValue(artistResponse);
    mockListSongs.mockResolvedValueOnce(songsResponse);

    let history;

    await waitFor(() => history = renderComponentAsUser(<ArtistPage artistId={1} />, 1));

    userEvent.click(screen.getByText('Delete Artist'));
    userEvent.click(screen.getByText('Delete Forever'));

    expect(mockDeleteArtist).toHaveBeenCalledTimes(1);
    expect(mockDeleteArtist).toHaveBeenCalledWith(1);
    expect(history.location.pathname).toEqual('/');
  });
});