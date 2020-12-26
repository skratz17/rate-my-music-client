import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ArtistAutocompleteSearchBar } from './ArtistAutocompleteSearchBar';
import { api } from '../../api';

jest.mock('../../api');
const mockSearchArtists = (api.artists.search = jest.fn());

describe('artist autocomplete search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('fetches artist search results, allows user to select or unselect an artist', async () => {
    mockSearchArtists.mockResolvedValue({
      count: 2,
      data: [ { id: 1, name: 'The Magnetic Fields' }, { id: 2, name: 'of Montreal' } ]
    });
    const mockSelectHandler = jest.fn();

    render(<ArtistAutocompleteSearchBar onSelect={mockSelectHandler} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toEqual('The Magnetic Fields');

    await userEvent.click(buttons[0]);

    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({ id: 1, name: 'The Magnetic Fields' });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('The Magnetic Fields')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('if given a default value will initially render in selected state', () => {
    render(<ArtistAutocompleteSearchBar defaultValue={{ id: 1, name: 'Jim O\'Rourke' }} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Jim O\'Rourke')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});