import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ListFavoriteControl } from './ListFavoriteControl';

describe('list favorite control functionality', () => {
  test('renders button with favorite text if unfavorited', () => {
    render(<ListFavoriteControl isFavorited={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Favorite List');
  });

  test('renders buton with unfavorite text if favorited', () => {
    render(<ListFavoriteControl isFavorited={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Unfavorite List');
  });

  test('renders favorite count', () => {
    render(<ListFavoriteControl favCount={8} />);

    expect(screen.getByText('8')).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const mockClickHandler = jest.fn();

    render(<ListFavoriteControl onClick={mockClickHandler} />);

    await userEvent.click(screen.getByRole('button'));
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});