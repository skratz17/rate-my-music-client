import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { UserContext } from '../user/UserProvider';
import { PlayerContext } from '../player/PlayerProvider';
import { SongPage } from './SongPage';
import { api } from '../../api';
jest.mock('../../api');

const mockGetSong = (api.songs.get = jest.fn());
const mockDeleteSong = (api.songs.delete = jest.fn());
const mockListLists = (api.lists.list = jest.fn());
const mockListRatings = (api.ratings.list = jest.fn());

const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const SONG_RESPONSE = {
  "id": 2,
  "name": "Later On",
  "year": 2014,
  "artist": {
      "id": 1,
      "name": "KoeeoaddiThere",
      "creator": 2
  },
  "genres": [
      {
          "id": 2,
          "genre": {
              "id": 1,
              "name": "Indie"
          }
      },
      {
          "id": 3,
          "genre": {
              "id": 8,
              "name": "Folk"
          }
      }
  ],
  "sources": [
      {
          "id": 2,
          "url": "https://soundcloud.com/koeeoaddithere/later-on",
          "service": "Soundcloud",
          "isPrimary": true,
          "song": 2
      }
  ],
  "avgRating": null,
  "creator": {
      "id": 2,
  }
};

const renderComponentAsUser = (ui, userId) => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ user: { id: userId } }}>
      <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
        <Router history={history}>{ui}</Router>
      </PlayerContext.Provider>
    </UserContext.Provider>
  );

  return history;
};

describe('song page functionality', () => {
  test('gets song data, lists for song, and ratings for song on load', async () => {
    await waitFor(() => renderComponentAsUser(<SongPage songId={2} />, 1));

    expect(mockGetSong).toHaveBeenCalledTimes(1);
    expect(mockGetSong).toHaveBeenCalledWith(2);

    expect(mockListLists).toHaveBeenCalledTimes(1);
    expect(mockListLists).toHaveBeenCalledWith({ songId: 2, page: 1, pageSize: 10 });

    expect(mockListRatings).toHaveBeenCalledTimes(2);
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, orderBy: 'date', direction: 'desc', page: 1, pageSize: 10 });
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, userId: 1 });
  });

  test('clicking on a rating list sort option will refetch list data', async () => {
    await waitFor(() => renderComponentAsUser(<SongPage songId={2} />, 1));

    expect(mockListRatings).toHaveBeenCalledTimes(2);
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, orderBy: 'date', direction: 'desc', page: 1, pageSize: 10 });
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, userId: 1 });

    const buttons = screen.getAllByRole('button');
    const ratingSortButton = buttons.find(button => button.textContent === 'Rating');

    await waitFor(() => userEvent.click(ratingSortButton));

    expect(mockListRatings).toHaveBeenCalledTimes(3);
    expect(mockListRatings).toHaveBeenLastCalledWith({ songId: 2, orderBy: 'rating', direction: 'asc', page: 1, pageSize: 10 });
  });

  test('renders edit and delete controls if user is creator of song', async () => {
    mockGetSong.mockResolvedValueOnce(SONG_RESPONSE);

    await waitFor(() => renderComponentAsUser(<SongPage songId={2} />, 2));

    expect(screen.getByText('edit')).toBeInTheDocument();
    expect(screen.getByText('Delete Song')).toBeInTheDocument();
  });

  test('does not render edit or delete controls if user is not creator of song', async () => {
    mockGetSong.mockResolvedValueOnce(SONG_RESPONSE);

    await waitFor(() => renderComponentAsUser(<SongPage songId={2} />, 1));

    expect(screen.queryByText('edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Song')).not.toBeInTheDocument();
  });

  test('edit links to song edit page', async () => {
    mockGetSong.mockResolvedValueOnce(SONG_RESPONSE);

    let history;
    await waitFor(() => history = renderComponentAsUser(<SongPage songId={2} />, 2));

    await userEvent.click(screen.getByText('edit'));

    expect(history.location.pathname).toEqual('/songs/2/edit');
  });

  test('confirming delete calls song delete function and redirects to /', async () => {
    mockGetSong.mockResolvedValueOnce(SONG_RESPONSE);

    let history;
    await waitFor(() => history = renderComponentAsUser(<SongPage songId={2} />, 2));

    await userEvent.click(screen.getByText('Delete Song'));
    await userEvent.click(screen.getByText('Delete Forever'));

    expect(history.location.pathname).toEqual('/');   
  });
});