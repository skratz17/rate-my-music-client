import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SongListSortOptions } from './SongListSortOptions';

const orderingData = {
  orderBy: 'year',
  direction: 'asc'
};

describe('song list sort options functionality', () => {
  test('renders all sort options by default', () => {
    render(<SongListSortOptions orderingData={orderingData} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    expect(buttons[0].textContent).toEqual('Year');
    expect(buttons[1].textContent).toEqual('Name');
    expect(buttons[2].textContent).toEqual('Average Rating');
    expect(buttons[3].textContent).toEqual('Artist');
  });

  test('renders only sort options in fields array if passed as props', () => {
    render(<SongListSortOptions orderingData={orderingData} fields={['year', 'artist']} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].textContent).toEqual('Year');
    expect(buttons[1].textContent).toEqual('Artist');
  });

  test('calls onSelectSortOption with direction of desc if user clicks on already-selected ordering option that is ordered asc', async () => {
    const mockSelectHandler = jest.fn();
    render(<SongListSortOptions orderingData={orderingData} onSelectSortOption={mockSelectHandler} />);

    await userEvent.click(screen.getByText('Year'));
    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      orderBy: 'year',
      direction: 'desc'
    });
  });

  test('calls onSelectSortOption with direction of asc if user clicks on already-selected ordering option that is ordered desc', async () => {
    const mockSelectHandler = jest.fn();
    render(<SongListSortOptions onSelectSortOption={mockSelectHandler} 
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
    render(<SongListSortOptions orderingData={orderingData} onSelectSortOption={mockSelectHandler} />);

    await userEvent.click(screen.getByText('Artist'));
    expect(mockSelectHandler).toHaveBeenCalledTimes(1);
    expect(mockSelectHandler).toHaveBeenCalledWith({
      orderBy: 'artist',
      direction: 'asc'
    });
  });
});