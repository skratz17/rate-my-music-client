import React from 'react';
import { render, screen } from '@testing-library/react';

import { LoadingWrapper } from './LoadingWrapper';

describe('loading wrapper functionality', () => {
  test('should render loading indicator and children if loading', () => {
    render(<LoadingWrapper isLoading={true}><p data-testid="1234">hi</p></LoadingWrapper>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('1234')).toBeInTheDocument();
  });

  test('should render only children if not loading', () => {
    render(<LoadingWrapper isLoading={false}><p data-testid="1234">hi</p></LoadingWrapper>);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByTestId('1234')).toBeInTheDocument();
  });
});