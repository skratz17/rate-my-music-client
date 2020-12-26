import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SongAutocompleteSearchBar } from './SongAutocompleteSearchBar';
import { api } from '../../api';

jest.mock('../../api');
const mockSearchSongs = (api.songs.search = jest.fn());

describe('song autocomplete search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('fetches song search results, allows user to select or unselect a song', async () => {
    mockSearchSongs.mockResolvedValue({
      count: 2,
      data: [ 
        { id: 1, name: 'Famous', artist: { id: 2, name: 'The Magnetic Fields' } }, 
        { id: 2, name: 'Baby', artist: { id: 3, name: 'of Montreal' } } 
      ]
    });
    const mockSelectHandler = jest.fn();

    render(<SongAutocompleteSearchBar onSelect={mockSelectHandler} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toEqual('Famous - The Magnetic Fields');
    expect(buttons[1].textContent).toEqual('Baby - of Montreal');

    await userEvent.click(buttons[0]);

    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      id: 1,
      name: 'Famous',
      artist: {
        id: 2,
        name: 'The Magnetic Fields'
      }
    });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Famous')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('if given a default value will initially render in selected state', () => {
    render(<SongAutocompleteSearchBar defaultValue={{
      id: 1,
      name: 'Hilltop Procession Momentum Gaining'
    }} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Hilltop Procession Momentum Gaining')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});