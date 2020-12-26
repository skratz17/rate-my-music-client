import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GenreAutocompleteSelector } from './GenreAutocompleteSelector';
import { api } from '../../api';

jest.mock('../../api');
const mockSearchGenres = (api.genres.search = jest.fn());

describe('genre autocomplete selector functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('fetches genre search results, allows user to select or unselect genres', async () => {
    mockSearchGenres.mockResolvedValueOnce({
      count: 2,
      data: [ { id: 1, name: 'Indie Pop' }, { id: 2, name: 'Indie Folk' } ]
    });
    const mockSelectHandler = jest.fn();

    render(<GenreAutocompleteSelector onSelect={mockSelectHandler} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'i'));

    await waitFor(() => jest.advanceTimersByTime(500));

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toEqual('Indie Pop');

    await userEvent.click(buttons[0]);

    expect(mockSelectHandler).toHaveBeenCalledTimes(2);
    expect(mockSelectHandler).toHaveBeenCalledWith([{ id: 1, name: 'Indie Pop' }]);

    const clearIndiePopButton = screen.getByText('Remove Indie Pop');
    expect(clearIndiePopButton).toBeInTheDocument();
    await userEvent.click(clearIndiePopButton);

    expect(mockSelectHandler).toHaveBeenCalledTimes(3);
    expect(mockSelectHandler).toHaveBeenCalledWith([]);

    expect(screen.queryByText('Remove Indie Pop')).not.toBeInTheDocument();
  });

  test('renders default values as already selected if given in props', async () => {
    const defaultGenres = [
      { id: 1, name: 'Black Metal' },
      { id: 2, name: 'Bubblegum Pop' }
    ];

    render(<GenreAutocompleteSelector onSelect={() => {}} defaultValue={defaultGenres} />);

    const clearGenreButtons = screen.getAllByRole('button');
    expect(clearGenreButtons).toHaveLength(2);
    expect(clearGenreButtons[0].textContent).toEqual('Remove Black Metal');
    expect(clearGenreButtons[1].textContent).toEqual('Remove Bubblegum Pop');

    await waitFor(() => jest.runAllTimers())
  });
});