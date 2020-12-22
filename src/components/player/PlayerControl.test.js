import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerControl } from './PlayerControl';

describe('player control functionality', () => {
  test('renders as a button with accessible name and children that calls onClick when clicked', async () => {
    const mockClickHandler = jest.fn();

    render(<PlayerControl accessibleName="Test" onClick={mockClickHandler} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test');

    await userEvent.click(button);

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});