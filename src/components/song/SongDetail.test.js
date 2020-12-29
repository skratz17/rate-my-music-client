import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { SongDetail } from './SongDetail';
import { PlayerContext } from '../player/PlayerProvider';

const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(
    <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
      <Router history={history}>
        {ui}
      </Router>
    </PlayerContext.Provider>
  );

  return history;
};

const song = {
  id: 1,
  name: 'Famous',
  artist: {
    id: 3,
    name: 'The Magnetic Fields'
  },
  avgRating: 4,
  year: 1996,
  sources: [
    { service: 'YouTube', url: 'https://www.youtube.com/watch?v=n3L-4vASZ5s', isPrimary: true },
    { service: 'SoundCloud', url: 'https://soundcloud.com/themagneticfields/famous-1', isPrimary: false }
  ],
  genres: [
    { id: 1, genre: { id: 1, name: 'Indie Pop' } }
  ]
};

describe('song detail view functionality', () => {
  test('renders basic song information and artist name as link', () => {
    const history = renderComponent(<SongDetail song={song} />);

    expect(screen.getByText('Famous')).toBeInTheDocument();

    const artistLink = screen.getByText('The Magnetic Fields');
    userEvent.click(artistLink);
    expect(history.location.pathname).toEqual('/artists/3');

    expect(screen.getByText('Avg. Rating: 4 / 5')).toBeInTheDocument();

    const yearLink = screen.getByText('1996');
    expect(yearLink).toBeInTheDocument();
    userEvent.click(yearLink);
    expect(history.location.pathname).toEqual('/charts');
    expect(history.location.search).toEqual('?startYear=1996&endYear=1996');

    const genreLink = screen.getByText('Indie Pop');
    expect(genreLink).toBeInTheDocument();
    userEvent.click(genreLink);
    expect(history.location.pathname).toEqual('/charts');
    expect(history.location.search).toEqual('?genres=1');
  });

  test('renders dropdown with song sources which defaults to song\'s primary source', () => {
    renderComponent(<SongDetail song={song} />);

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue('https://www.youtube.com/watch?v=n3L-4vASZ5s');
    expect(dropdown).toHaveDisplayValue('YouTube');
  });

  test('clicking play button will play the source selected in the dropdown', () => {
    renderComponent(<SongDetail song={song} />);

    userEvent.click(screen.getByRole('button'));
    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenCalledWith([{
      id: 1,
      name: 'Famous',
      artist: {
        id: 3,
        name: 'The Magnetic Fields'
      },
      avgRating: 4,
      year: 1996,
      sources: [
        { service: 'YouTube', url: 'https://www.youtube.com/watch?v=n3L-4vASZ5s', isPrimary: true }
      ],
      genres: [
        { id: 1, genre: { id: 1, name: 'Indie Pop' } }
      ]
    }]);

    expect(mockPlayQueue).toHaveBeenCalledTimes(1);

    const dropdown = screen.getByRole('combobox');
    userEvent.selectOptions(dropdown, 'https://soundcloud.com/themagneticfields/famous-1');

    userEvent.click(screen.getByRole('button'));
    expect(mockSetQueue).toHaveBeenCalledTimes(2);
    expect(mockSetQueue).toHaveBeenCalledWith([{
      id: 1,
      name: 'Famous',
      artist: {
        id: 3,
        name: 'The Magnetic Fields'
      },
      avgRating: 4,
      year: 1996,
      sources: [
        { service: 'SoundCloud', url: 'https://soundcloud.com/themagneticfields/famous-1', isPrimary: false }
      ],
      genres: [
        { id: 1, genre: { id: 1, name: 'Indie Pop' } }
      ]
    }]);

    expect(mockPlayQueue).toHaveBeenCalledTimes(2);
  });
});