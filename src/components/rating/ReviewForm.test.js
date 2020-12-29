import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewForm } from './ReviewForm';

describe('review form validation', () => {
  test('all fields are required', async () => {
    const mockSubmitHandler = jest.fn();
    render(<ReviewForm onSubmit={mockSubmitHandler} />);

    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(await screen.findByText('Review is required.')).toBeInTheDocument();
    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });
});

describe('review form functionality', () => {
  test('form populates with review text if given as props', () => {
    render(<ReviewForm review="Good." />);

    expect(screen.getByDisplayValue('Good.')).toBeInTheDocument();
  });

  test('form calls onSubmit with review text when submitted', async () => {
    const mockSubmitHandler = jest.fn();
    render(<ReviewForm onSubmit={mockSubmitHandler} />);

    userEvent.type(screen.getByRole('textbox'), 'It good.');

    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    expect(mockSubmitHandler).toHaveBeenCalledWith('It good.');
  });
});