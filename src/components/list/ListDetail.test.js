import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListDetail } from './ListDetail';
import { PlayerContext } from '../player/PlayerProvider';

const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(
    <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
      <Router history={history}>{ui}</Router>
    </PlayerContext.Provider>
  );

  return history;
};

const LIST = {
  "id": 1,
  "name": "My favorite songs",
  "description": "Here are a few of my favorite tunes",
  "songs": [
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
  ],
  "creator": {
      "id": 2,
      "bio": "Just a cool boi.",
      "user": {
          "id": 2,
          "username": "jweckert17",
          "firstName": "Jacob",
          "lastName": "Eckert"
      }
  },
  "favCount": 1
}

describe('list detail functionality', () => {
  test('renders list name, description, username as link', async () => {
    const history = renderComponent(<ListDetail list={LIST} />);

    expect(screen.getByText('My favorite songs')).toBeInTheDocument();
    expect(screen.getByText('Here are a few of my favorite tunes'));

    const usernameLink = screen.getByRole('link');
    expect(usernameLink).toBeInTheDocument();
    expect(usernameLink).toHaveTextContent('jweckert17');
    await userEvent.click(usernameLink);

    expect(history.location.pathname).toEqual('/profiles/2');
  });

  test('play button queues songs in list when clicked', async () => {
    renderComponent(<ListDetail list={LIST} />);

    await userEvent.click(screen.getByText('Play all songs in list "My favorite songs"'));

    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenCalledWith([
      {
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

      {
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
      }
    ]);

    expect(mockPlayQueue).toHaveBeenCalledTimes(1);
  });
});