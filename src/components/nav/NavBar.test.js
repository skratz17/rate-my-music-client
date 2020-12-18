import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import React from 'react';

import { NavBar } from './NavBar';
import { UserContext } from '../user/UserProvider';

const renderComponent = value => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={value}>
      <Router history={history}>
        <NavBar />
      </Router>
    </UserContext.Provider>
  );
};

describe('navbar rendering', () => {
  test('should display static link names, as well as username from context for profile link', () => {
    renderComponent({ user: { user: { username: 'skratz17' }}});

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);

    expect(links[0].textContent).toEqual('RMM');
    expect(links[1].textContent).toEqual('charts');
    expect(links[2].textContent).toEqual('lists');
    expect(links[3].textContent).toEqual('contribute');
    expect(links[4].textContent).toEqual('skratz17');
    expect(links[5].textContent).toEqual('(logout)');
  });
});