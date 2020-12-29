import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListPage } from './ListPage';
import { api } from '../../api';
import { PlayerContext } from '../player/PlayerProvider';
import { UserContext } from '../user/UserProvider';

jest.mock('../../api');
const mockGetList = (api.lists.get = jest.fn());
const mockDeleteList = (api.lists.delete = jest.fn());
const mockFavoriteList = (api.lists.favorite = jest.fn());
const mockUnfavoriteList = (api.lists.unfavorite = jest.fn());

const LIST_RESPONSE = {
  id: 8,
  name: 'My favorite songs',
  description: 'Some good tunes',
  songs: [
    { 
      id: 1, 
      song: {
        id: 1,
        name: 'Save a Secret for the Moon',
        year: 1996,
        artist: {
          id: 1,
          name: 'The Magnetic Fields'
        },
        sources: [
          {
            "id": 3,
            "url": "https://www.youtube.com/watch?v=4rk_9cYOp8A",
            "service": "YouTube",
            "is_primary": true,
            "song": 3
          }
        ]
      },
      description: 'Secret saving.'
    }
  ],
  creator: {
    id: 2,
    user: {
      username: 'jweckert17'
    }
  }
};

const renderComponentAsUser = (ui, userId) => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ user: { id: userId } }}>
      <PlayerContext.Provider value={{ setQueue: jest.fn() }}>
        <Router history={history}>
          {ui}
        </Router>
      </PlayerContext.Provider>
    </UserContext.Provider>
  );

  return history;
};

describe('list page functionality', () => {
  test('should get list by id on load', async () => {
    await waitFor(() => renderComponentAsUser(<ListPage listId={8} />, 1));

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(8);
  });

  test('should render delete and edit buttons if user created list', async () => {
    mockGetList.mockResolvedValueOnce(LIST_RESPONSE);

    await waitFor(() => renderComponentAsUser(<ListPage listId={8} />, 2));

    expect(screen.getByText('edit')).toBeInTheDocument();
    expect(screen.getByText('Delete List')).toBeInTheDocument();
  });

  test('should not delete or edit buttons if user did not create list', async () => {
    mockGetList.mockResolvedValueOnce(LIST_RESPONSE);

    await waitFor(() => renderComponentAsUser(<ListPage listId={8} />, 1));

    expect(screen.queryByText('edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete List')).not.toBeInTheDocument();
  });

  test('edit option links to list edit page', async () => {
    mockGetList.mockResolvedValueOnce(LIST_RESPONSE);
    let history;

    await waitFor(() => history = renderComponentAsUser(<ListPage listId={8} />, 2));

    await userEvent.click(screen.getByText('edit'));
    expect(history.location.pathname).toEqual('/lists/8/edit');
  });

  test('confirming delete button calls delete list function and redirects to homepage', async () => {
    mockGetList.mockResolvedValueOnce(LIST_RESPONSE);
    let history;

    await waitFor(() => history = renderComponentAsUser(<ListPage listId={8} />, 2));

    await userEvent.click(screen.getByText('Delete List'));
    await userEvent.click(screen.getByText('Delete Forever'));

    expect(mockDeleteList).toHaveBeenCalledTimes(1);
    expect(mockDeleteList).toHaveBeenCalledWith(8);

    expect(history.location.pathname).toEqual('/');
  });

  test('calls list favorite function if user clicks favorite control on unfavorited list', async () => {
    mockGetList.mockResolvedValueOnce({ ...LIST_RESPONSE, hasRaterFavorited: false });

    await waitFor(() => renderComponentAsUser(<ListPage listId={8} />, 2));

    await waitFor(() => userEvent.click(screen.getByText('Favorite List')));

    expect(mockFavoriteList).toHaveBeenCalledTimes(1);
    expect(mockFavoriteList).toHaveBeenCalledWith(8);
  });

  test('calls list unfavorite function if user clicks favorite control on favorited list', async () => {
    mockGetList.mockResolvedValueOnce({ ...LIST_RESPONSE, hasRaterFavorited: true });

    await waitFor(() => renderComponentAsUser(<ListPage listId={8} />, 2));

    await waitFor(() => userEvent.click(screen.getByText('Unfavorite List')));

    expect(mockUnfavoriteList).toHaveBeenCalledTimes(1);
    expect(mockUnfavoriteList).toHaveBeenCalledWith(8);
  });
});