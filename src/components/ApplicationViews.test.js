import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { LocalStorageMock } from '@react-mock/localstorage';

import { ApplicationViews } from './ApplicationViews';

describe('application views routing', () => {
  test('navigation to /logout clears localStorage value and redirects to /', async () => {
    const history = createMemoryHistory();
    history.push('/logout');
    render(
      <LocalStorageMock items={{ 'rmm_user': '1234' }}>
        <Router history={history}>
          <ApplicationViews />
        </Router>
      </LocalStorageMock>
    );

    await waitFor(() => expect(localStorage.getItem('rmm_user')).toBeNull());
    expect(history.location.pathname).toEqual('/');
  });
});