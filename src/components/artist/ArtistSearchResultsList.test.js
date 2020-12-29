import React from 'react';
import { render, screen, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ArtistSearchResultsList } from './ArtistSearchResultsList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const ARTISTS = [
  { 
    id: 1, 
    name: 'The Magnetic Fields' 
  } 
];

describe('artist search results list functionality', () => {
  test('renders list of artists with link to artist page and artist name text', () => {
    const history = renderComponent(<ArtistSearchResultsList artists={ARTISTS} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItem = screen.getByRole('listitem');

    expect(listItem).toBeInTheDocument();

    expect(getByText(listItem, 'The Magnetic Fields')).toBeInTheDocument();

    userEvent.click(screen.getByRole('link'));

    expect(history.location.pathname).toEqual('/artists/1');
  });
});