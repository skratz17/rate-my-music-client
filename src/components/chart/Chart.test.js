import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Chart } from './Chart';
import { PlayerContext } from '../player/PlayerProvider';

import { api } from '../../api';
jest.mock('../../api');

const mockListSongs = (api.songs.list = jest.fn());
const mockSearchGenres = (api.genres.search = jest.fn());
const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const renderComponent = ui => {
  render(
    <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
      <Router history={createMemoryHistory()}>
        {ui}
      </Router>
    </PlayerContext.Provider>
  )
};

const SONGS_RESPONSE = [
  {
      "id": 1,
      "name": "Half-Life",
      "year": 2014,
      "artist": {
          "id": 1,
          "name": "KoeeoaddiThere",
      },
      "genres": [
          {
              "id": 1,
              "genre": {
                  "id": 1,
                  "name": "Indie Pop"
              }
          }
      ],
      "sources": [
          {
              "id": 1,
              "url": "https://soundcloud.com/koeeoaddithere/half-life",
              "service": "Soundcloud",
              "isPrimary": true,
              "song": 1
          }
      ],
      "avgRating": 4
  },
  {
      "id": 2,
      "name": "Later On",
      "year": 2014,
      "artist": {
          "id": 1,
          "name": "KoeeoaddiThere",
      },
      "genres": [
          {
              "id": 2,
              "genre": {
                  "id": 2,
                  "name": "Indie Folk"
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
      "avgRating": 4
  }
];

describe('chart functionality', () => {
  test('on load fetches songs list sorted by avg rating descending', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(mockListSongs).toHaveBeenCalledWith({ orderBy: 'avgRating', direction: 'desc' });
  });

  test('renders two dropdowns and a textbox', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('selecting a value in the start year dropdown refetches songs list with selected year', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    const startYearDropdown = screen.getAllByRole('combobox')[0];

    await waitFor(() => userEvent.selectOptions(startYearDropdown, '1992'));
    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenCalledWith({ orderBy: 'avgRating', direction: 'desc', startYear: '1992' });
  });

  test('selecting a value in the end year dropdown refetches songs list with selected year', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    const endYearDropdown = screen.getAllByRole('combobox')[1];

    await waitFor(() => userEvent.selectOptions(endYearDropdown, '1996'));
    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenCalledWith({ orderBy: 'avgRating', direction: 'desc', endYear: '1996' });
  });

  test('selecting a genre in the genre autocomplete selector refetches songs list with selected genre', async () => {
    mockSearchGenres.mockResolvedValue([ { id: 1, name: 'Indie Folk' }, { id: 2, name: 'Indie Pop' } ]);
    jest.useFakeTimers();

    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));

    const genreSearchbar = screen.getByRole('textbox');
    await waitFor(() => userEvent.type(genreSearchbar, 'ind'));
    await waitFor(() => jest.advanceTimersByTime(500));
    expect(mockSearchGenres).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Indie Folk')).toBeInTheDocument();
    expect(await screen.findByText('Indie Pop')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByText('Indie Folk')));

    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenCalledWith({ orderBy: 'avgRating', direction: 'desc', genres: [ 1 ]});
  });

  test('clicking play button will queue songs in songs list response', async () => {
    mockListSongs.mockResolvedValueOnce(SONGS_RESPONSE);

    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    await waitFor(() => userEvent.click(screen.getByText('Play All Songs in Chart')));

    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenCalledWith(SONGS_RESPONSE);
    
    expect(mockPlayQueue).toHaveBeenCalledTimes(1);
  });
});