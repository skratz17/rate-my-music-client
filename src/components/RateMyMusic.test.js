import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { LocalStorageMock } from '@react-mock/localstorage';
import React from 'react';
import { Router } from 'react-router-dom';

import { RateMyMusic } from './RateMyMusic';

describe('main app redirection based on auth', () => {
  test('should redirect to login if unauthorized', () => {
    const history = createMemoryHistory();
    render(
      <LocalStorageMock>
        <Router history={history}>
          <RateMyMusic />
        </Router>
      </LocalStorageMock>
    );

    expect(localStorage.getItem('rmm_user')).toBe(null);
    expect(history.location.pathname).toEqual('/login');
  });

  test('should redirect to home if authorized', () => {
    const history = createMemoryHistory();
    render(
      <LocalStorageMock items={{ 'rmm_user': '1234' }}>
        <Router history={history}>
          <RateMyMusic />
        </Router>
      </LocalStorageMock>
    );

    expect(localStorage.getItem('rmm_user')).toBe('1234');
    expect(history.location.pathname).toEqual('/home');
  });
});