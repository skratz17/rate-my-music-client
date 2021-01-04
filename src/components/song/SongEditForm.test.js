import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { api } from '../../api';
import { UserContext } from '../user/UserProvider';
import { SongEditForm } from './SongEditForm';

jest.mock('../../api');
const mockGetSong = (api.songs.get = jest.fn());

const renderComponent = (ui, contextData) => {
  const history = createMemoryHistory();
  history.push('/songs/4/edit');

  render(
    <UserContext.Provider value={contextData}>
      <Router history={history}>
        {ui}
      </Router>
    </UserContext.Provider>
  );

  return history;
};

const songApiResponse = {
  "id": 4,
  "name": "You and Me and the Moon",
  "year": 1996,
  "artist": {
      "id": 2,
      "name": "The Magnetic Fields",
      "description": "Actually way better than KT.",
      "foundedYear": 1989,
      "creator": 3
  },
  "genres": [
      {
          "id": 5,
          "genre": {
              "id": 1,
              "name": "Indie Pop"
          }
      }
  ],
  "sources": [
      {
          "id": 4,
          "url": "https://www.youtube.com/watch?v=r1aLwEQc6LM",
          "service": "YouTube",
          "isPrimary": true,
          "song": 4
      }
  ],
  "createdAt": "2020-11-16T12:00:00Z",
  "avgRating": null,
  "creator": {
    "id": 2,
    "bio": "Just a cool boi.",
    "user": {
        "id": 2,
        "username": "jweckert17",
        "firstName": "Jacob",
        "lastName": "Eckert"
    }
  }
};

describe('song edit form functionality', () => {
  test('fetches song with id passed in props on load and renders edit form with song data prepopulated', async () => {
    mockGetSong.mockResolvedValueOnce(songApiResponse);

    renderComponent(<SongEditForm songId={4} />, { user: { id: 2 } });

    expect(mockGetSong).toHaveBeenCalledTimes(1);
    expect(mockGetSong).toHaveBeenCalledWith(4);

    expect(await screen.findByRole('form')).toBeInTheDocument();

    expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('You and Me and the Moon'));
    expect(screen.getByText('The Magnetic Fields')).toBeInTheDocument();
    expect(screen.getByText('Clear Artist')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toEqual(screen.getByDisplayValue('1996'));
    expect(screen.getByText('Remove Indie Pop')).toBeInTheDocument();
    expect(screen.getByLabelText('Song URL')).toEqual(screen.getByDisplayValue('https://www.youtube.com/watch?v=r1aLwEQc6LM'));
    expect(screen.getByLabelText('Is Primary?')).toBeChecked();
  });

  test('redirects to / if user editing song did not create song', async () => {
    mockGetSong.mockResolvedValueOnce(songApiResponse);

    const history = renderComponent(<SongEditForm songId={4} />, { user: { id: 1 } });

    expect(history.location.pathname).toEqual('/songs/4/edit');
    await waitFor(() => expect(history.location.pathname).toEqual('/'));
  });

  test('renders errors message and no form if song load error', async () => {
    mockGetSong.mockRejectedValueOnce({ message: 'Song load failed.' });

    renderComponent(<SongEditForm songId={1} />, { user: { id: 2 } });

    expect(await screen.findByText('Song load failed.')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});