import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { api } from '../../api';
import { Stats } from './Stats';

jest.mock('../../api');
const mockGetStats = (api.stats.get = jest.fn());

describe('stats page functionality', () => {
  test('initially displays a header and a loading indicator', async () => {
    const promise = Promise.resolve();
    mockGetStats.mockImplementationOnce(() => promise);
    render(<Stats />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual('RMM Stats');

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => promise);
  });

  test('fetches and renders stats from stats api in a list', async () => {
    mockGetStats.mockResolvedValueOnce({ users: 9, artists: 2, songs: 4, lists: 1 });
    render(<Stats />);

    expect(mockGetStats).toHaveBeenCalledTimes(1);

    expect(await screen.findByRole('list')).toBeInTheDocument();
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(4);

    expect(listItems[0].textContent).toEqual('9 users');
    expect(listItems[1].textContent).toEqual('2 artists');
    expect(listItems[2].textContent).toEqual('4 songs');
    expect(listItems[3].textContent).toEqual('1 lists');
  });

  test('renders error message and does not render stats on error', async () => {
    mockGetStats.mockRejectedValueOnce({ message: 'Failed to get stats.' });

    render(<Stats />);

    expect(mockGetStats).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Failed to get stats.')).toBeInTheDocument();

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});