import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UnauthorizedUserViews } from './UnauthorizedUserViews';

const renderComponentAtRoute = route => {
  render(
    <MemoryRouter initialEntries={[ route ]}>
      <UnauthorizedUserViews />
    </MemoryRouter>
  );
};

describe('routes are properly set up', () => {
  test('/login renders login component', () => {
    renderComponentAtRoute('/login');

    expect(screen.getByText('Log In To Your Account')).toBeInTheDocument();
  });

  test ('/register renders register component', () => {
    renderComponentAtRoute('/register');

    expect(screen.getByText('Register a New Account')).toBeInTheDocument();
  });

  test('all other routes redirect to /login', () => {
    renderComponentAtRoute('/saodifjiodfj');

    expect(screen.getByText('Log In To Your Account')).toBeInTheDocument();
  });
});
