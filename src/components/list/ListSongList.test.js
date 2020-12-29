import React from 'react';
import { render, screen, getAllByRole, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListSongList } from './ListSongList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const LIST_SONGS = [
  {
      "id": 1,
      "song": {
          "id": 1,
          "name": "Half-Life",
          "year": 2014,
          "artist": {
              "id": 1,
              "name": "KoeeoaddiThere",
              "description": "Probably the best indie artist of all time.",
              "foundedYear": 2012,
              "creator": 2
          },
          "sources": [
              {
                  "id": 1,
                  "url": "https://soundcloud.com/koeeoaddithere/half-life",
                  "service": "Soundcloud",
                  "isPrimary": true,
                  "song": 1
              }
          ]
      },
      "description": "Here is a masterpiece that I made."
  },
  {
      "id": 2,
      "song": {
          "id": 3,
          "name": "Save a Secret for the Moon",
          "year": 1996,
          "artist": {
              "id": 2,
              "name": "The Magnetic Fields",
              "description": "The Magnetic Fields (named after the André Breton/Philippe Soupault novel Les Champs Magnétiques)[1] are an American band founded and led by Stephin Merritt. Merritt is the group's primary songwriter, producer, and vocalist, as well as frequent multi-instrumentalist. The Magnetic Fields is essentially a vehicle for Merritt's songwriting, as are various side-projects including The 6ths, Future Bible Heroes, and The Gothic Archies. Merritt's recognizable lyrics are often about love and with atypical or neutral gender roles, and are by turns ironic, tongue-in-cheek, bitter, and humorous.",
              "foundedYear": 1989,
              "creator": 3
          },
          "sources": [
              {
                  "id": 3,
                  "url": "https://www.youtube.com/watch?v=4rk_9cYOp8A",
                  "service": "YouTube",
                  "isPrimary": true,
                  "song": 3
              }
          ]
      },
      "description": "Here is a masterpiece that Stephin Merritt made."
  }
];

describe('list song list functionality', () => {
  test('renders all songs in list, with link to song, link to artist, and description', () => {
    const history = renderComponent(<ListSongList listSongs={LIST_SONGS} />);

    expect(screen.getByRole('list')).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    const firstSongLinks = getAllByRole(listItems[0], 'link');
    expect(firstSongLinks).toHaveLength(2);
    expect(firstSongLinks[0]).toHaveTextContent('Half-Life');
    expect(firstSongLinks[1]).toHaveTextContent('KoeeoaddiThere');

    userEvent.click(firstSongLinks[0]);
    expect(history.location.pathname).toEqual('/songs/1')
    userEvent.click(firstSongLinks[1]);
    expect(history.location.pathname).toEqual('/artists/1')

    const secondSongLinks = getAllByRole(listItems[1], 'link');
    expect(secondSongLinks).toHaveLength(2);
    expect(secondSongLinks[0]).toHaveTextContent('Save a Secret for the Moon');
    expect(secondSongLinks[1]).toHaveTextContent('The Magnetic Fields');

    userEvent.click(secondSongLinks[0]);
    expect(history.location.pathname).toEqual('/songs/3')
    userEvent.click(secondSongLinks[1]);
    expect(history.location.pathname).toEqual('/artists/2')

    expect(getByText(listItems[0], 'Here is a masterpiece that I made.')).toBeInTheDocument();
    expect(getByText(listItems[1], 'Here is a masterpiece that Stephin Merritt made.')).toBeInTheDocument();
  });
});