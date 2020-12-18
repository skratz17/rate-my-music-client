import { render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { UnauthorizedUserViews } from './UnauthorizedUserViews';

const renderComponentAtRoute = route => {
  const history = createMemoryHistory();
  history.push(route);

  render(
    <Router history={history}>
      <UnauthorizedUserViews />
    </Router>
  );

  return history;
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
    const history = renderComponentAtRoute('/saodifjiodfj');

    expect(history.location.pathname).toEqual('/login');
  });
});
