import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AutocompleteSearchBar } from './AutocompleteSearchBar';

const mockSearch = jest.fn();

describe('autocomplete search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('should render list of results from delayed search bar', async () => {
    mockSearch.mockResolvedValue([ { id: 1, name: 'The Magnetic Fields' }, { id: 2, name: 'of Montreal' } ])

    render(<AutocompleteSearchBar onSearch={mockSearch} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(await screen.findByRole('list')).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(screen.getByText('The Magnetic Fields')).toBeInTheDocument();
    expect(screen.getByText('of Montreal')).toBeInTheDocument();
  });

  test('clicking on a result calls onSelect', async () => {
    mockSearch.mockResolvedValue([ { id: 1, name: 'The Magnetic Fields' } ])
    const mockSelectHandler = jest.fn();

    render(<AutocompleteSearchBar onSearch={mockSearch} onSelect={mockSelectHandler} />)

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    const selectButton = await screen.findByRole('button');
    expect(selectButton).toBeInTheDocument();

    await userEvent.click(selectButton);

    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({ id: 1, name: 'The Magnetic Fields' });
  });
});