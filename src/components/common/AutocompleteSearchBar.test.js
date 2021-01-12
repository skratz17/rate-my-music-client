import React from 'react';
import { render, screen, waitFor, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AutocompleteSearchBar } from './AutocompleteSearchBar';

const mockSearch = jest.fn();

describe('autocomplete search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('should render list of results from delayed search bar', async () => {
    mockSearch.mockResolvedValue({
      count: 2,
      data: [ { id: 1, name: 'The Magnetic Fields' }, { id: 2, name: 'of Montreal' } ]
    });

    render(<AutocompleteSearchBar onSearch={mockSearch} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(await screen.findByRole('list')).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(getByText(listItems[0], 'The Magnetic Fields')).toBeInTheDocument();
    expect(getByText(listItems[1], 'of Montreal')).toBeInTheDocument();
    expect(getByText(listItems[2], /Page 1/)).toBeInTheDocument();
  });

  test('clicking on a result calls onSelect', async () => {
    mockSearch.mockResolvedValue({
      count: 1,
      data: [ { id: 1, name: 'The Magnetic Fields' } ]
    });
    const mockSelectHandler = jest.fn();

    render(<AutocompleteSearchBar onSearch={mockSearch} onSelect={mockSelectHandler} />)

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));

    await waitFor(() => jest.advanceTimersByTime(500));

    const buttons = await screen.findAllByRole('button');
    const selectButton = buttons[0];
    expect(selectButton).toBeInTheDocument();
    expect(getByText(selectButton, 'The Magnetic Fields')).toBeInTheDocument();

    userEvent.click(selectButton);

    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({ id: 1, name: 'The Magnetic Fields' });
  });

  test('clicking outside of the component when results are showing stops the results from showing', async () => {
    mockSearch.mockResolvedValue({
      count: 1,
      data: [ { id: 1, name: 'The Magnetic Fields' }]
    });

    render(
      <div>
        <p data-testid="1234">Click me</p>
        <AutocompleteSearchBar onSearch={mockSearch} />
      </div>
    );

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));
    await waitFor(() => jest.advanceTimersByTime(500));

    const buttons = await screen.findAllByRole('button');
    const selectButton = buttons[0];
    expect(selectButton).toBeInTheDocument();
    expect(getByText(selectButton, 'The Magnetic Fields')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('1234'));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('clicking back inside of the component after clicking outside will show the previous results again', async () => {
    mockSearch.mockResolvedValue({
      count: 1,
      data: [ { id: 1, name: 'The Magnetic Fields' }]
    });

    render(
      <div>
        <p data-testid="1234">Click me</p>
        <AutocompleteSearchBar onSearch={mockSearch} />
      </div>
    );

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'a'));
    await waitFor(() => jest.advanceTimersByTime(500));

    userEvent.click(screen.getByTestId('1234'));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('textbox'));
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument('The Magnetic Fields');
    expect(buttons[0]).toHaveTextContent('The Magnetic Fields');
  });
});