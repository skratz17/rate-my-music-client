import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RatingControl } from './RatingControl';

describe('rating control functionality', () => {
  test('renders value props count of filled stars by default', () => {
    render(<RatingControl value={3} />);

    expect(screen.getAllByTestId('filled-star')).toHaveLength(3);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
  });

  test('renders as many filled stars as the button value user has hovered over', () => {
    render(<RatingControl value={3} />);

    userEvent.hover(screen.getByText('Rate song 5 out of 5'));
    expect(screen.getAllByTestId('filled-star')).toHaveLength(5);
    expect(screen.queryAllByTestId('empty-star')).toHaveLength(0);
  });

  test('renders as many filled stars as the button value user has focused', () => {
    render(<RatingControl value={3} />);

    userEvent.tab();

    expect(screen.getAllByRole('button')[0]).toHaveFocus();
    expect(screen.getAllByTestId('filled-star')).toHaveLength(1);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(4);
  });

  test('hovering out of a button will return control to initial render state', () => {
    render(<RatingControl value={3} />);

    userEvent.hover(screen.getByText('Rate song 5 out of 5'));
    userEvent.unhover(screen.getByText('Rate song 5 out of 5'));

    expect(screen.getAllByTestId('filled-star')).toHaveLength(3);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
  });

  test('clicking a button will call onClick with the value clicked', () => {
    const mockClickHandler = jest.fn();
    render(<RatingControl value={3} onClick={mockClickHandler} />);

    userEvent.click(screen.getByText('Rate song 4 out of 5'));
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
    expect(mockClickHandler).toHaveBeenCalledWith(4);
  });
});