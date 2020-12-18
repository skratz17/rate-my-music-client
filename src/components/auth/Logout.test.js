import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Logout } from './Logout';
import { UserContext } from '../user/UserProvider';

const mockLogout = jest.fn();
const mockIsLoggedIn = jest.fn();

const renderComponent = () => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ logout: mockLogout, isLoggedIn: mockIsLoggedIn }}>
      <Router history={history}>
        <Logout />
      </Router>
    </UserContext.Provider>
  );

  return history;
}

describe('logout functionality', () => {
  test('calls logout if rendered when logged in', () => {
    mockIsLoggedIn.mockImplementation(() => true);

    renderComponent();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('redirects if rendered when not logged in', () => {
    mockIsLoggedIn.mockImplementation(() => false);

    const history = renderComponent();

    expect(history.location.pathname).toEqual('/');
  });
});