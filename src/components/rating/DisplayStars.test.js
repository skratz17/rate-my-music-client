import React from 'react';
import { render, screen } from '@testing-library/react';

import { DisplayStars } from './DisplayStars';

describe('display stars functionality', () => {
  test('renders value count of filled stars, and (5 - value) count of empty stars', () => {
    render(<DisplayStars value={3} />);

    expect(screen.getAllByTestId('filled-star')).toHaveLength(3);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
  });

  test('renders screen readabale representation (i think)', () => {
    render(<DisplayStars value={2} />);

    expect(screen.getByText('2 stars out of 5')).toBeInTheDocument();
  });
});