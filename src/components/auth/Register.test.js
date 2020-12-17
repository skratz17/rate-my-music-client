import { render, screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Register } from './Register';

describe('registration form validation', () => {
  test('all fields are required', async () => {
    render(<Register />);

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
    render(<Register />);

    await userEvent.type(screen.getByLabelText('Username'), 'user~');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Username may only contain letters, numbers, and @.+-_ characters.')).toBeInTheDocument();
  });

  test('email must be valid email format', async () => {
    render(<Register />);

    await userEvent.type(screen.getByLabelText('Email'), 'invalid');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Must be a valid email address.')).toBeInTheDocument();
  });

  test('password confirmation must match password', async () => {
    render(<Register />);

    await userEvent.type(screen.getByLabelText('Password'), 'test');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'testt');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Passwords must match.')).toBeInTheDocument();
  });
});
