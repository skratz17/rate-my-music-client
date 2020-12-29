import React from 'react';
import { render, screen, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { SongSearchResultsList } from './SongSearchResultsList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const SONGS = [
  { 
    id: 1, 
    name: 'Save a Secret for the Moon', 
    artist: {
      name: 'The Magnetic Fields'
    }
  } 
];

describe('song search results list functionality', () => {
  test('renders list of songs with link to song page and song name and artist name text', () => {
    const history = renderComponent(<SongSearchResultsList songs={SONGS} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItem = screen.getByRole('listitem');

    expect(listItem).toBeInTheDocument();

    expect(getByText(listItem, 'Save a Secret for the Moon')).toBeInTheDocument();
    expect(getByText(listItem, 'The Magnetic Fields')).toBeInTheDocument();

    userEvent.click(screen.getByRole('link'));

    expect(history.location.pathname).toEqual('/songs/1');
  });
});