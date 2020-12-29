import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('button functionality', () => {
  test('renders a button with given text that calls the given onClick function', () => {
    const mockClickHandler = jest.fn();
    render(<Button onClick={mockClickHandler}>Test Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual('Test Button');

    expect(mockClickHandler).toHaveBeenCalledTimes(0);
    userEvent.click(button);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});