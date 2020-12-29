import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RemoveButton } from './RemoveButton';

describe('remove button functionality', () => {
  test('renders as a button that calls onClick function when clicked', () => {
    const mockClickHandler = jest.fn();
    render(<RemoveButton onClick={mockClickHandler} />);

    userEvent.click(screen.getByRole('button'));
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  test('renders as a disabled button that does not call onClick when clicked if disabled', () => {
    const mockClickHandler = jest.fn();
    render(<RemoveButton disabled={true} onClick={mockClickHandler} />);

    userEvent.click(screen.getByRole('button'));
    expect(mockClickHandler).toHaveBeenCalledTimes(0);
  });
});