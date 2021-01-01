import React from 'react';
import { render, screen } from '@testing-library/react';

import { Duration } from './Duration';

describe('duration functionality', () => {
  test('displays seconds value converted to time string if non-null value supplied', () => {
    render(<Duration seconds={312} />);

    expect(screen.getByText('5:12')).toBeInTheDocument();
  });

  test('displays -- if null value passed in', () => {
    render(<Duration seconds={null} />);

    expect(screen.getByText('--')).toBeInTheDocument();
  });
});