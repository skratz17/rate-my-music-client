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
const mockListGenres = (api.genres.list = jest.fn());
const mockUpdateQueue = jest.fn();

const renderComponent = (ui, url = '/charts') => {
  const history = createMemoryHistory();
  history.push(url);

  render(
    <PlayerContext.Provider value={{ updateQueue: mockUpdateQueue }}>
      <Router history={history}>
        {ui}
      </Router>
    </PlayerContext.Provider>
  );

  return history;
};

const SONGS_RESPONSE = {
    count: 2,
    data: [
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
  ]
};

describe('chart functionality', () => {
  test('on load fetches songs list sorted by avg rating descending', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(mockListSongs).toHaveBeenLastCalledWith({ orderBy: 'avgRating', direction: 'desc', page: 1, pageSize: 10 });
  });

  test('renders two dropdowns and a textbox', async () => {
    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('selecting a value in the start year dropdown refetches songs list with selected year and updates query string', async () => {
    const history = renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    const startYearDropdown = screen.getAllByRole('combobox')[0];

    await waitFor(() => userEvent.selectOptions(startYearDropdown, '1992'));
    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenLastCalledWith({ orderBy: 'avgRating', direction: 'desc', startYear: '1992', page: 1, pageSize: 10 });
    expect(history.location.search).toEqual('?startYear=1992');
  });

  test('selecting a value in the end year dropdown refetches songs list with selected year and updates query string', async () => {
    const history = renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    const endYearDropdown = screen.getAllByRole('combobox')[1];

    await waitFor(() => userEvent.selectOptions(endYearDropdown, '1996'));
    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenLastCalledWith({ orderBy: 'avgRating', direction: 'desc', endYear: '1996', page: 1, pageSize: 10 });
    expect(history.location.search).toEqual('?endYear=1996');
  });

  test('selecting a genre in the genre autocomplete selector refetches songs list with selected genre and updates query string', async () => {
    mockSearchGenres.mockResolvedValue({
      count: 2,
      data: [ { id: 1, name: 'Indie Folk' }, { id: 2, name: 'Indie Pop' } ]
    });
    jest.useFakeTimers();

    const history = renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));

    const genreSearchbar = screen.getByRole('textbox');
    await waitFor(() => userEvent.type(genreSearchbar, 'ind'));
    await waitFor(() => jest.advanceTimersByTime(500));
    expect(mockSearchGenres).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Indie Folk')).toBeInTheDocument();
    expect(await screen.findByText('Indie Pop')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByText('Indie Folk')));

    expect(mockListSongs).toHaveBeenCalledTimes(2);
    expect(mockListSongs).toHaveBeenLastCalledWith({ orderBy: 'avgRating', direction: 'desc', genres: [ 1 ], page: 1, pageSize: 10 });
    expect(history.location.search).toEqual('?genres=1');
  });

  test('clicking play button will queue songs in songs list response', async () => {
    mockListSongs.mockResolvedValueOnce(SONGS_RESPONSE);

    renderComponent(<Chart />);

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    await waitFor(() => userEvent.click(screen.getByText('Play All Songs in Chart')));

    expect(mockUpdateQueue).toHaveBeenCalledTimes(1);
    expect(mockUpdateQueue).toHaveBeenLastCalledWith(SONGS_RESPONSE.data);
  });

  test('initializes startYear value from query string parameter', async () => {
    renderComponent(<Chart />, '/charts?startYear=1994');

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(mockListSongs).toHaveBeenCalledWith({
      orderBy: 'avgRating',
      direction: 'desc',
      startYear: '1994',
      page: 1,
      pageSize: 10
    });

    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns[0]).toHaveDisplayValue('1994');
    expect(dropdowns[1]).toHaveDisplayValue('any');
  });

  test('initializes endYear value from query string parameter', async () => {
    renderComponent(<Chart />, '/charts?endYear=1994');

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(mockListSongs).toHaveBeenCalledWith({
      orderBy: 'avgRating',
      direction: 'desc',
      endYear: '1994',
      page: 1,
      pageSize: 10
    });

    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns[0]).toHaveDisplayValue('any');
    expect(dropdowns[1]).toHaveDisplayValue('1994');
  });

  test('initializes genres value from query string parameter, and genre autocomplete selector shows genre names', async () => {
    mockListGenres.mockResolvedValueOnce({
      count: 2,
      data: [ 
        { id: 1, name: 'Indie Pop' },
        { id: 2, name: 'Black Metal' }
      ]
    });

    renderComponent(<Chart />, '/charts?genres=1,2');

    await waitFor(() => expect(mockListSongs).toHaveBeenCalledTimes(1));
    expect(mockListSongs).toHaveBeenCalledWith({
      orderBy: 'avgRating',
      direction: 'desc',
      genres: [ 1, 2 ],
      page: 1,
      pageSize: 10
    });

    await waitFor(() => expect(mockListGenres).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Indie Pop')).toBeInTheDocument();
    expect(screen.getByText('Black Metal')).toBeInTheDocument();
  });
});