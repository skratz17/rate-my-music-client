import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { SongPage } from './SongPage';
import { api } from '../../api';
jest.mock('../../api');

const mockGetSong = (api.songs.get = jest.fn());
const mockListLists = (api.lists.list = jest.fn());
const mockListRatings = (api.ratings.list = jest.fn());

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

describe('song page functionality', () => {
  test('gets song data, lists for song, and ratings for song on load', async () => {
    await waitFor(() => renderComponent(<SongPage songId={2} />));

    expect(mockGetSong).toHaveBeenCalledTimes(1);
    expect(mockGetSong).toHaveBeenCalledWith(2);

    expect(mockListLists).toHaveBeenCalledTimes(1);
    expect(mockListLists).toHaveBeenCalledWith({ songId: 2 });

    expect(mockListRatings).toHaveBeenCalledTimes(1);
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2 });
  });
});