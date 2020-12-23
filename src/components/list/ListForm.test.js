import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router }  from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListForm } from './ListForm';
import { api } from '../../api';
import { user } from '../../api/user';

jest.mock('../../api');
const mockPostList = (api.lists.create = jest.fn());
const mockSearchSongs = (api.songs.search = jest.fn());

describe('list form validation', () => {
  test('all fields are required and you cannot remove a song if only one in list', async () => {
    render(<ListForm />);

    await waitFor(() => userEvent.click(screen.getByText('Create List')));

    expect(await screen.findByText('List name is required.')).toBeInTheDocument();
    expect(await screen.findByText('List description is required.')).toBeInTheDocument();
    expect(await screen.findByText('Song is required.')).toBeInTheDocument();
    expect(await screen.findByText('Song description is required.')).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button');
    expect(removeButtons[0]).toHaveTextContent('Remove song from list');
    expect(removeButtons[0]).toBeDisabled();
  });

  test('all songs must be unique', async () => {
    const initialValues = {
      name: 'test',
      description: 'test',
      songs: [
        { songId: 1, description: 'hi' },
        { songId: 1, description: 'hey' }
      ]
    };

    render(<ListForm list={initialValues} />);

    await waitFor(() => userEvent.click(screen.getByText('Create List')));
    expect(await screen.findByText('Each song in the list must be unique.'));
  });
});

describe('list form functionality', () => {
  const renderComponent = ui => {
    const history = createMemoryHistory();

    render(<Router history={history}>{ui}</Router>);

    return history;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('calls list create method with list data on submit and redirects to list detail page', async () => {
    const history = renderComponent(<ListForm />);

    mockSearchSongs.mockResolvedValueOnce([
      { id: 4, name: 'Famous', artist: { id: 1, name: 'The Magnetic Fields' } }
    ]);
    mockPostList.mockResolvedValueOnce({ id: 1 });

    await waitFor(() => userEvent.type(screen.getByLabelText('Name'), 'Test'));
    await waitFor(() => userEvent.type(screen.getByLabelText('Description'), 'Test Description'));
    await waitFor(() => userEvent.type(screen.getByLabelText('Song'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));
    expect(await screen.findByText('Famous - The Magnetic Fields')).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByText('Famous - The Magnetic Fields')));

    await waitFor(() => userEvent.type(screen.getByLabelText('Song Description'), 'Test Song Description'));

    await waitFor(() => userEvent.click(screen.getByText('Create List')));

    expect(mockPostList).toHaveBeenCalledTimes(1);
    expect(mockPostList).toHaveBeenCalledWith({
      name: 'Test',
      description: 'Test Description',
      songs: [
        { id: 4, description: 'Test Song Description' }
      ]
    });

    await waitFor(() => expect(history.location.pathname).toEqual('/lists/1'));
  });
});