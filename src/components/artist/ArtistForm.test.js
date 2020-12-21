import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ArtistForm } from './ArtistForm';
import { api } from '../../api';

jest.mock('../../api');
const mockPostArtist = (api.artists.create = jest.fn());
const mockUpdateArtist = (api.artists.update = jest.fn());

describe('artist form validation', () => {
  test('all fields are required', async () => {
    render(<ArtistForm />);

    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Artist name is required.')).toBeInTheDocument();
    expect(await screen.findByText('Founded year must be a number.')).toBeInTheDocument();
    expect(await screen.findByText('Description is required.')).toBeInTheDocument();
  });

  test('year founded must be >= 1850', async () => {
    render(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Year Founded'), '1849');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Year must be on or after 1850.')).toBeInTheDocument();
  });

  test('year founded must be <= current year', async () => {
    const currentYear = (new Date()).getFullYear();

    render(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Year Founded'), String(currentYear + 1));
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText(`Year must be on or earlier than the current year.`)).toBeInTheDocument();
  });
});

describe('artist form functionality', () => {
  const renderComponent = ui => {
    const history = createMemoryHistory();

    render(<Router history={history}>{ui}</Router>);

    return history;
  };

  test('renders create / new text when no artist passed in as props', () => {
    render(<ArtistForm />);

    expect(screen.getByRole('heading').textContent).toEqual('New Artist');
    expect(screen.getByRole('button').textContent).toEqual('Create Artist');
  });

  test('renders edit / update text when artist passed in as props', () => {
    const artist = {
      id: 2,
      name: 'of Montreal',
      foundedYear: 1996,
      description: 'So good.'
    };

    render(<ArtistForm artist={artist} />);

    expect(screen.getByRole('heading').textContent).toEqual('Edit Artist');
    expect(screen.getByRole('button').textContent).toEqual('Update Artist');
  });

  test('calls artist create api function on submit and redirects to artist page', async () => {
    mockPostArtist.mockImplementationOnce(artistData => Promise.resolve({ ...artistData, id: 1 }));

    const history = renderComponent(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Name'), 'of Montreal');
    await userEvent.type(screen.getByLabelText('Year Founded'), '1996');
    await userEvent.type(screen.getByLabelText('Description'), 'The best out of Athens.');
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockPostArtist).toHaveBeenCalledTimes(1));
    expect(mockPostArtist).toHaveBeenCalledWith({
      name: 'of Montreal',
      foundedYear: 1996,
      description: 'The best out of Athens.'
    });

    await waitFor(() => expect(history.location.pathname).toEqual('/artists/1'));
  });

  test('renders error message if artist create failed', async () => {
    mockPostArtist.mockRejectedValueOnce({ message: 'Artist creation failed.' });

    render(<ArtistForm />);

    await userEvent.type(screen.getByLabelText('Name'), 'of Montreal');
    await userEvent.type(screen.getByLabelText('Year Founded'), '1996');
    await userEvent.type(screen.getByLabelText('Description'), 'The best out of Athens.');
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockPostArtist).toHaveBeenCalledTimes(1));

    expect(await screen.findByText('Artist creation failed.')).toBeInTheDocument();
  });

  test('renders with default values if artist object passed as props, calls update function on submit, and redirects to artist page', async () => {
    mockUpdateArtist.mockImplementationOnce((id, artistData) => Promise.resolve({ ...artistData, id }));

    const artist = {
      id: 2,
      name: 'of Montreal',
      foundedYear: 1996,
      description: 'So good.'
    };

    const history = renderComponent(<ArtistForm artist={artist} />);

    expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('of Montreal'));
    expect(screen.getByLabelText('Year Founded')).toEqual(screen.getByDisplayValue('1996'));
    expect(screen.getByLabelText('Description')).toEqual(screen.getByDisplayValue('So good.'));

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(mockUpdateArtist).toHaveBeenCalledTimes(1));
    expect(mockUpdateArtist).toHaveBeenCalledWith(2, {
      name: 'of Montreal',
      foundedYear: 1996,
      description: 'So good.'
    });

    await waitFor(() => expect(history.location.pathname).toEqual('/artists/2'));
  });
});