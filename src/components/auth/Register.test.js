import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalStorageMock } from '@react-mock/localstorage';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { api } from '../../api';
import { Register } from './Register';

jest.mock('../../api');
const mockRegister = (api.auth.register = jest.fn());

const renderComponent = () => {
  const history = createMemoryHistory();
  history.push('/register');

  render(
    <LocalStorageMock>
      <Router history={history}>
        <Register />
      </Router>
    </LocalStorageMock>
  );

  return history;
}

describe('registration form validation', () => {
  test('all fields are required', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Username is required.')).toBeInTheDocument();
    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(await screen.findByText('Password is required.')).toBeInTheDocument();
    expect(await screen.findByText('Confirm password is required.')).toBeInTheDocument();
    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required.')).toBeInTheDocument();
    expect(await screen.findByText('Bio is required.')).toBeInTheDocument();
  });

  test('username must contain only valid characters', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText('Username'), 'user~');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Username may only contain letters, numbers, and @.+-_ characters.')).toBeInTheDocument();
  });

  test('email must be valid email format', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText('Email'), 'invalid');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Must be a valid email address.')).toBeInTheDocument();
  });

  test('password confirmation must match password', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'testt');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Passwords must match.')).toBeInTheDocument();
  });
});

describe('registration form functionality', () => {
  test('registers an account, sets token in local storage, and redirects user to home on success', async () => {
    mockRegister.mockResolvedValueOnce({ token: '1234' });

    const history = renderComponent();

    await userEvent.type(screen.getByLabelText('Username'), 'test');
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'test');
    await userEvent.type(screen.getByLabelText('First Name'), 'test');
    await userEvent.type(screen.getByLabelText('Last Name'), 'test');
    await userEvent.type(screen.getByLabelText('Bio'), 'test');

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));
    expect(mockRegister).toHaveBeenCalledWith({
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      passwordConfirmation: 'test',
      firstName: 'test',
      lastName: 'test',
      bio: 'test'
    });

    await waitFor(() => expect(localStorage.getItem('rmm_user')).toBe('1234'));
    expect(history.location.pathname).toEqual('/home');
  });

  test('renders error message on register error', async () => {
    mockRegister.mockRejectedValueOnce({ message: 'A user with that username already exists.' });

    const history = renderComponent();

    await userEvent.type(screen.getByLabelText('Username'), 'test');
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'test');
    await userEvent.type(screen.getByLabelText('First Name'), 'test');
    await userEvent.type(screen.getByLabelText('Last Name'), 'test');
    await userEvent.type(screen.getByLabelText('Bio'), 'test');

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));

    expect(await screen.findByText('A user with that username already exists.')).toBeInTheDocument();
    expect(localStorage.getItem('rmm_user')).toBeNull();
    expect(history.location.pathname).toEqual('/register');
  });
});
