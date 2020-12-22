import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayButton } from './PlayButton';

describe('play button functionality', () => {
  test('should render as a button with accesible text that calls onClick when clicked', async () => {
    const mockClickHandler = jest.fn();
    render(<PlayButton onClick={mockClickHandler} accessibleName="Play All Magnetic Fields Songs" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Play All Magnetic Fields Songs'));
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});