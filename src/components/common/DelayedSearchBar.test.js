import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DelayedSearchBar } from './DelayedSearchBar';
import { api } from '../../api';

jest.mock('../../api');
const mockListArtists = (api.artists.list = jest.fn());

describe('delayed search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('calls onSearch method with searchTerm after duration timeout, then calls onResults with results', async () => {
    mockListArtists.mockResolvedValueOnce([ { name: 'of Montreal' }, { name: 'The Magnetic Fields' } ]);

    const mockSearchHandler = jest.fn();
    mockSearchHandler.mockImplementation(async searchTerm => {
      if(searchTerm) {
        return await api.artists.list({ q: searchTerm });
      }
    });

    const mockResultsHandler = jest.fn();

    render(<DelayedSearchBar onSearch={mockSearchHandler} onResults={mockResultsHandler} />);

    expect(mockSearchHandler).toHaveBeenCalledTimes(1);
    expect(mockSearchHandler).toHaveBeenCalledWith('');
    expect(mockListArtists).not.toHaveBeenCalled();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    expect(mockSearchHandler).toHaveBeenCalledTimes(1);

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(mockSearchHandler).toHaveBeenCalledTimes(2);
    expect(mockSearchHandler).toHaveBeenCalledWith('a');
    expect(mockListArtists).toHaveBeenCalledTimes(1);
    expect(mockListArtists).toHaveBeenCalledWith({ q: 'a' });

    await waitFor(() => expect(mockResultsHandler).toHaveBeenCalledWith([ { name: 'of Montreal' }, { name: 'The Magnetic Fields' } ]));
  });
});