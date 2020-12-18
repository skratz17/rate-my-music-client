import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { RateMyMusic } from './RateMyMusic';
import { UserContext } from './user/UserProvider';

const renderComponent = (ui, value) => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={value}>
      <Router history={history}>
        {ui}
      </Router>
    </UserContext.Provider>
  );

  return history;
};

describe('main app redirection based on auth', () => {
  test('should redirect to login if unauthorized', () => {
    const value = {
      isLoggedIn: () => false
    };

    const history = renderComponent(<RateMyMusic />, value);

    expect(history.location.pathname).toEqual('/login');
  });

  test('should render a navbar and redirect to home if authorized', () => {
    const value = {
      isLoggedIn: () => true
    };

    const history = renderComponent(<RateMyMusic />, value);

    expect(history.location.pathname).toEqual('/home');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});