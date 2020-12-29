import React from 'react';
import { render, screen } from '@testing-library/react';

import { GenreBadge } from './GenreBadge';

describe('genre badge functionality', () => {
  test('should render children', () => {
    render(<GenreBadge>Indie Pop</GenreBadge>);

    expect(screen.getByText('Indie Pop')).toBeInTheDocument();
  });
});