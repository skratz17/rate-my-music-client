import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PaginationControls } from './PaginationControls';

describe('pagination controls functionality', () => {
  test('renders as previous page button, next page button, current page number, and page size options', () => {
    render(<PaginationControls page={3} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    expect(buttons[0]).toHaveTextContent('Previous Page');
    expect(buttons[1]).toHaveTextContent('Next Page');
    expect(buttons[2]).toHaveTextContent('10');
    expect(buttons[3]).toHaveTextContent('25');
    expect(buttons[4]).toHaveTextContent('50');

    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });

  test('clicking previous page button calls onPreviousPage function', () => {
    const mockPreviousPageHandler = jest.fn();

    render(<PaginationControls page={2} onPreviousPage={mockPreviousPageHandler} />);

    userEvent.click(screen.getByText('Previous Page'));
    expect(mockPreviousPageHandler).toHaveBeenCalledTimes(1);
  });

  test('clicking next page button calls onNextPage function', () => {
    const mockNextPageHandler = jest.fn();

    render(<PaginationControls page={3} isLastPage={false} onNextPage={mockNextPageHandler} />);

    userEvent.click(screen.getByText('Next Page'));
    expect(mockNextPageHandler).toHaveBeenCalledTimes(1);
  });

  test('previous page button is disabled when page is 1', () => {
    render(<PaginationControls page={1} />);

    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  test('next page button is disabled when on the last page', () => {
    render(<PaginationControls page={2} isLastPage={true} />);

    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });
});