import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DelayedInput } from './DelayedInput';

describe('delayed search bar functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('calls onDelayedChange with input value after duration timeout', async () => {
    const mockDelayedChangeHandler = jest.fn();

    render(
      <DelayedInput onDelayedChange={mockDelayedChangeHandler} 
        duration={500} />
      );

    userEvent.type(screen.getByRole('textbox'), 'test');

    expect(mockDelayedChangeHandler).toHaveBeenCalledTimes(0);

    await waitFor(() => jest.advanceTimersByTime(500));

    expect(mockDelayedChangeHandler).toHaveBeenCalledTimes(1);
    expect(mockDelayedChangeHandler).toHaveBeenCalledWith('test');
  });
});