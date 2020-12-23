import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ListSortOptions } from './ListSortOptions';

const orderingData = {
  orderBy: 'year',
  direction: 'asc'
};

const songListSortOptions = [
  { name: 'year', displayName: 'Year' },
  { name: 'name', displayName: 'Name' },
  { name: 'avgRating', displayName: 'Average Rating' },
  { name: 'artist', displayName: 'Artist' }
];

describe('song list sort options functionality', () => {
  test('renders sort options in fields array passed as props', () => {
    render(<ListSortOptions type="song" orderingData={orderingData} fields={songListSortOptions} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    expect(buttons[0].textContent).toEqual('Year');
    expect(buttons[1].textContent).toEqual('Name');
    expect(buttons[2].textContent).toEqual('Average Rating');
    expect(buttons[3].textContent).toEqual('Artist');
  });

  test('calls onSelectSortOption with direction of desc if user clicks on already-selected ordering option that is ordered asc', async () => {
    const mockSelectHandler = jest.fn();
    render(<ListSortOptions orderingData={orderingData} fields={songListSortOptions} onSelectSortOption={mockSelectHandler} />);

    await userEvent.click(screen.getByText('Year'));
    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      orderBy: 'year',
      direction: 'desc'
    });
  });

  test('calls onSelectSortOption with direction of asc if user clicks on already-selected ordering option that is ordered desc', async () => {
    const mockSelectHandler = jest.fn();
    render(<ListSortOptions fields={songListSortOptions} onSelectSortOption={mockSelectHandler} 
      orderingData={{ orderBy: 'year', direction: 'desc' }} />
    );

    await userEvent.click(screen.getByText('Year'));
    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      orderBy: 'year',
      direction: 'asc'
    });
  });

  test('calls onSelectSortOption with direction of asc if user clicks on ordering option that is not currently selected', async () => {
    const mockSelectHandler = jest.fn();
    render(<ListSortOptions orderingData={orderingData} fields={songListSortOptions} onSelectSortOption={mockSelectHandler} />);

    await userEvent.click(screen.getByText('Artist'));
    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      orderBy: 'artist',
      direction: 'asc'
    });
  });
});