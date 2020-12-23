import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewFormToggler } from './ReviewFormToggler';

describe('review form toggler functionality', () => {
  test('initially renders no button or review textarea if no rating given as props', () => {
    render(<ReviewFormToggler />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('renders button that toggles expanded state on click', async () => {
    render(<ReviewFormToggler rating={{ id: 2, review: 'asdf' }} />);

    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent('Write a Review (collapsed)');

    await userEvent.click(expandButton);
    expect(expandButton).toHaveTextContent('Write a Review (expanded)');
    
    await userEvent.click(expandButton);
    expect(expandButton).toHaveTextContent('Write a Review (collapsed)');
  });
});