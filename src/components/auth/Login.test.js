import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LocalStorageMock } from '@react-mock/localstorage';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { api } from '../../api';
import { Login } from './Login';

jest.mock('../../api');
const mockLogin = (api.auth.login = jest.fn());

describe('login form validation', () => {
  test('all fields are required', async () => {
    render(<Login />);

    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('Username is required.')).toBeInTheDocument();
    expect(await screen.findByText('Password is required.')).toBeInTheDocument();
  });
});

describe('login form functionality', () => {
  const renderComponent = () => {
    const history = createMemoryHistory();
    history.push('/login');

    render(
      <LocalStorageMock>
        <Router history={history}>
          <Login />
        </Router>
      </LocalStorageMock>
    );

    return history;
  }

  test('on login success sets localStorage token and redirects to /home', async () => {
    mockLogin.mockResolvedValueOnce({ token: '1234', valid: true });

    const history = renderComponent();

    await userEvent.type(screen.getByLabelText('Username'), 'test');
    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
    expect(mockLogin).toHaveBeenCalledWith({
      username: 'test',
      password: 'test'
    });

    await waitFor(() => expect(localStorage.getItem('rmm_user')).toBe('1234'));
    expect(history.location.pathname).toEqual('/home');
  });

  test('on login failure shows error message', async () => {
    mockLogin.mockRejectedValueOnce({ valid: false });

    const history = renderComponent();

    await userEvent.type(screen.getByLabelText('Username'), 'test');
    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
    expect(mockLogin).toHaveBeenCalledWith({
      username: 'test',
      password: 'test'
    });

    await waitFor(() => expect(localStorage.getItem('rmm_user')).toBeNull());
    expect(history.location.pathname).toEqual('/login');
  });
});