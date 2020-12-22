import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { SongList } from './SongList';

const SONGS = [
  {
    id: 1,
    name: 'Save a Secret for the Moon',
    artist: {
      id: 1,
      name: 'The Magnetic Fields'
    },
    avgRating: 4.5
  },

  {
    id: 2,
    name: 'Baby',
    artist: {
      id: 2,
      name: 'of Montreal'
    },
    avgRating: null
  }
];

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

describe('song list functionality', () => {
  test('renders a list of songs with clickable song and artist links', async () => {
    const history = renderComponent(<SongList songs={SONGS} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    await userEvent.click(links[0]);
    expect(history.location.pathname).toEqual('/songs/1');

    await userEvent.click(links[1]);
    expect(history.location.pathname).toEqual('/artists/1');

    await userEvent.click(links[2]);
    expect(history.location.pathname).toEqual('/songs/2');

    await userEvent.click(links[3]);
    expect(history.location.pathname).toEqual('/artists/2');
  });

  test('renders average rating if average rating value given', () => {
    renderComponent(<SongList songs={[ SONGS[0] ]} />);

    expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
  });

  test('renders -- for average rating if average rating is null', () => {
    renderComponent(<SongList songs={[ SONGS[1] ]} />);

    expect(screen.getByText('-- / 5')).toBeInTheDocument();
  });
});