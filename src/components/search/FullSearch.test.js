import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FullSearch } from './FullSearch';

import { api } from '../../api';
jest.mock('../../api');

const mockSearch = (api.search.search = jest.fn());

describe('full search functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('calls search api with search term and renders response as matching *SearchResultList component', async () => {
    mockSearch.mockResolvedValue({
      artists: [],
      songs: [],
      lists: []
    });

    await waitFor(() => render(<FullSearch />));

    userEvent.type(screen.getByRole('textbox'), 'test');

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith('test');

    expect(screen.getByText('There are no artists to display.')).toBeInTheDocument();
    expect(screen.getByText('There are no songs to display.')).toBeInTheDocument();
    expect(screen.getByText('There are no lists to display.')).toBeInTheDocument();
  });
});