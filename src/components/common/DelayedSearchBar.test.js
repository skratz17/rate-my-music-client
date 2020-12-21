import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DelayedSearchBar } from './DelayedSearchBar';
import { api } from '../../api';

jest.mock('../../api');
const mockSearchArtists = (api.artists.search = jest.fn());

describe('delayed search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('calls onSearch method with searchTerm after duration timeout, then calls onResults with results', async () => {
    mockSearchArtists.mockResolvedValueOnce([ { name: 'of Montreal' }, { name: 'The Magnetic Fields' } ]);
    const mockResultsHandler = jest.fn();

    render(<DelayedSearchBar onSearch={mockSearchArtists} onResults={mockResultsHandler} />);

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    expect(mockSearchArtists).not.toHaveBeenCalled();

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(mockSearchArtists).toHaveBeenCalledTimes(1);
    expect(mockSearchArtists).toHaveBeenCalledWith('a');

    await waitFor(() => expect(mockResultsHandler).toHaveBeenCalledWith([ { name: 'of Montreal' }, { name: 'The Magnetic Fields' } ]));
  });
});