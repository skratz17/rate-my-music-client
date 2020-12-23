import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { UserContext } from '../user/UserProvider';
import { SongPage } from './SongPage';
import { api } from '../../api';
jest.mock('../../api');

const mockGetSong = (api.songs.get = jest.fn());
const mockListLists = (api.lists.list = jest.fn());
const mockListRatings = (api.ratings.list = jest.fn());

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ user: {} }}>
      <Router history={history}>{ui}</Router>
    </UserContext.Provider>
  );

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
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, orderBy: 'date', direction: 'desc' });
  });

  test('clicking on a rating list sort option will refetch list data', async () => {
    await waitFor(() => renderComponent(<SongPage songId={2} />));

    expect(mockListRatings).toHaveBeenCalledTimes(1);
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, orderBy: 'date', direction: 'desc' });

    const buttons = screen.getAllByRole('button');
    const ratingSortButton = buttons.find(button => button.textContent === 'Rating');

    await waitFor(() => userEvent.click(ratingSortButton));

    expect(mockListRatings).toHaveBeenCalledTimes(2);
    expect(mockListRatings).toHaveBeenCalledWith({ songId: 2, orderBy: 'rating', direction: 'asc' });
  });
});