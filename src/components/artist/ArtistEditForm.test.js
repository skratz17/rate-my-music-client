import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen, waitFor } from '@testing-library/react';

import { api } from '../../api';
import { ArtistEditForm } from './ArtistEditForm';
import { UserContext } from '../user/UserProvider';

jest.mock('../../api');
const mockGetArtist = (api.artists.get = jest.fn());

const renderComponent = (ui, contextData) => {
  const history = createMemoryHistory();
  history.push('/artists/1/edit');

  render(
    <UserContext.Provider value={contextData}>
      <Router history={history}>
        {ui}
      </Router>
    </UserContext.Provider>
  );

  return history;
};

describe('artist edit form functionality', () => {
  test('fetches artist with id passed in props on load and renders edit form with artist data prepopulated', async () => {
    mockGetArtist.mockResolvedValueOnce({ id: 1, name: 'of Montreal', foundedYear: 1996, description: 'The band.', creator: { id: 1 } });

    renderComponent(<ArtistEditForm artistId={1} />, { user: { id: 1 } });

    expect(mockGetArtist).toHaveBeenCalledTimes(1);
    expect(mockGetArtist).toHaveBeenCalledWith(1);

    expect(await screen.findByRole('form')).toBeInTheDocument();

    expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('of Montreal'));
    expect(screen.getByLabelText('Year Founded')).toEqual(screen.getByDisplayValue('1996'));
    expect(screen.getByLabelText('Description')).toEqual(screen.getByDisplayValue('The band.'));
  });

  test('redirects to / if user attempting to edit artist is not creator of artist', async () => {
    mockGetArtist.mockResolvedValueOnce({ id: 1, name: 'of Montreal', foundedYear: 1996, description: 'The band.', creator: { id: 1 } });

    const history = renderComponent(<ArtistEditForm artistId={1} />, { user: { id: 2 } });

    expect(history.location.pathname).toEqual('/artists/1/edit');
    await waitFor(() => expect(history.location.pathname).toEqual('/'));
  });

  test('renders error message if artist load error occurred', async () => {
    mockGetArtist.mockRejectedValueOnce({ message: 'Artist load failed.' });

    renderComponent(<ArtistEditForm artistId={1} />, { user: { id: 1 } });

    expect(await screen.findByText('Artist load failed.')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});