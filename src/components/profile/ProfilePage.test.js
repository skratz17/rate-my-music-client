import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProfilePage } from './ProfilePage';
import { api } from '../../api';

jest.mock('../../api');
const mockGetUser = (api.user.get = jest.fn());
const mockListRatings = (api.ratings.list = jest.fn());
const mockListLists = (api.lists.list = jest.fn());

describe('profile page functionality', () => {
  test('fetches user data, ratings for user, and lists for user on load', async () => {
    await waitFor(() => render(<ProfilePage userId={3} />));

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockGetUser).toHaveBeenCalledWith(3);

    expect(mockListRatings).toHaveBeenCalledTimes(1);
    expect(mockListRatings).toHaveBeenCalledWith({
      orderBy: 'date',
      direction: 'desc',
      userId: 3
    });

    expect(mockListLists).toHaveBeenCalledTimes(1);
    expect(mockListLists).toHaveBeenCalledWith({
      userId: 3
    });
  });

  test('username and bio are rendered', async () => {
    mockGetUser.mockResolvedValueOnce({
      id: 3,
      bio: 'test bio',
      user: {
        username: 'test'
      }
    });

    await waitFor(() => render(<ProfilePage userId={3} />));

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('test');
    expect(screen.getByText('test bio')).toBeInTheDocument();
  });

  test('clicking on radio buttons in lists section refetches lists', async () => {
    mockGetUser.mockResolvedValueOnce({
      id: 3,
      bio: 'test bio',
      user: {
        username: 'test'
      }
    });

    await waitFor(() => render(<ProfilePage userId={3} />));

    const byUserRadioButton = screen.getByLabelText('Lists Created by test');
    const favoritesRadioButton = screen.getByLabelText('test\'s Favorites');

    expect(byUserRadioButton).toBeChecked();

    await waitFor(() => userEvent.click(favoritesRadioButton));

    expect(mockListLists).toHaveBeenCalledTimes(2);
    expect(mockListLists).toHaveBeenCalledWith({
      favoritedBy: 3
    });

    expect(favoritesRadioButton).toBeChecked();

    await waitFor(() => userEvent.click(byUserRadioButton));

    expect(mockListLists).toHaveBeenCalledTimes(3);
    expect(mockListLists).toHaveBeenCalledWith({
      userId: 3
    });
  });
});