import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { api } from '../../api';
import { UserContext } from '../user/UserProvider';
import { Register } from './Register';

jest.mock('../../api');
const mockRegister = (api.auth.register = jest.fn());

const mockSetUserToken = jest.fn();

const renderComponent = () => {
  const history = createMemoryHistory();
  history.push('/register');

  render(
    <UserContext.Provider value={{ setUserToken: mockSetUserToken }}>
      <Router history={history}>
        <Register />
      </Router>
    </UserContext.Provider>
  );

  return history;
}

describe('registration form validation', () => {
  test('all fields are required', async () => {
    renderComponent();

    userEvent.click(screen.getByRole('button'));

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

    userEvent.type(screen.getByLabelText('Username'), 'user~');
    userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Username may only contain letters, numbers, and @.+-_ characters.')).toBeInTheDocument();
  });

  test('email must be valid email format', async () => {
    renderComponent();

    userEvent.type(screen.getByLabelText('Email'), 'invalid');
    userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Must be a valid email address.')).toBeInTheDocument();
  });

  test('password confirmation must match password', async () => {
    renderComponent();

    userEvent.type(screen.getByLabelText('Password'), 'test');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'testt');
    userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Passwords must match.')).toBeInTheDocument();
  });
});

describe('registration form functionality', () => {
  test('registers an account, sets token in local storage, and redirects user to home on success', async () => {
    mockRegister.mockResolvedValueOnce({ token: '1234' });

    const history = renderComponent();

    userEvent.type(screen.getByLabelText('Username'), 'test');
    userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    userEvent.type(screen.getByLabelText('Password'), 'test');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'test');
    userEvent.type(screen.getByLabelText('First Name'), 'test');
    userEvent.type(screen.getByLabelText('Last Name'), 'test');
    userEvent.type(screen.getByLabelText('Bio'), 'test');

    userEvent.click(screen.getByRole('button'));

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

    expect(mockSetUserToken).toHaveBeenCalledTimes(1);
    expect(mockSetUserToken).toHaveBeenCalledWith('1234');
    expect(history.location.pathname).toEqual('/home');
  });

  test('renders error message on register error', async () => {
    mockRegister.mockRejectedValueOnce({ message: 'A user with that username already exists.' });

    const history = renderComponent();

    userEvent.type(screen.getByLabelText('Username'), 'test');
    userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    userEvent.type(screen.getByLabelText('Password'), 'test');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'test');
    userEvent.type(screen.getByLabelText('First Name'), 'test');
    userEvent.type(screen.getByLabelText('Last Name'), 'test');
    userEvent.type(screen.getByLabelText('Bio'), 'test');

    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));

    expect(await screen.findByText('A user with that username already exists.')).toBeInTheDocument();
    expect(mockSetUserToken).toHaveBeenCalledTimes(0);
    expect(history.location.pathname).toEqual('/register');
  });
});
