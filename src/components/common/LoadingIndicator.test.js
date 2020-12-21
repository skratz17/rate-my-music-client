import React from 'react';
import { render, screen } from '@testing-library/react';

import { LoadingIndicator } from './LoadingIndicator';

describe('loading indicator functionality', () => {
  test('shows loading text and image when loading', () => {
    render(<LoadingIndicator isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders nothing when isLoading is falsy', () => {
    const { container } = render(<>
      <LoadingIndicator isLoading={false} />
      <LoadingIndicator isLoading={null} />
      <LoadingIndicator />
    </>);

    expect(container).toBeEmptyDOMElement();
  });
});