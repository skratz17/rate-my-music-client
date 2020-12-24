import React from 'react';
import { render, screen } from '@testing-library/react';

import { Page } from './Page';

describe('page functionality', () => {
  test('should render props.children as children', () => {
    render(<Page><div data-testid="1234" /></Page>);

    expect(screen.getByTestId('1234')).toBeInTheDocument();
  });
});