import React from 'react';
import { render, screen, getByText, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Queue } from './Queue';
import { PlayerContext } from '../player/PlayerProvider';

const mockPlay = jest.fn();

const renderComponent = (ui, queue, currentSong) => {
  render(
    <PlayerContext.Provider value={{ 
      queue, 
      play: mockPlay,
      currentSong: currentSong || queue[0]
    }}>{ui}</PlayerContext.Provider>
  );
};

const TEST_QUEUE = [
  {
    id: 1,
    name: 'Save a Secret for the Moon',
    artist: {
      id: 1,
      name: 'The Magnetic Fields'
    },
    sources: [
      {
        service: 'YouTube',
        url: 'http://www.youtube.com/1234',
        isPrimary: true
      }
    ]
  },
  {
    id: 2,
    name: 'Aquarius',
    artist: {
      id: 2,
      name: 'Boards of Canada'
    },
    sources: [
      {
        service: 'YouTube',
        url: 'http://www.youtube.com/5678',
        isPrimary: true
      }
    ]
  }
];

describe('queue functionality', () => {
  test('should render song and artist name within listitems for each song in queue', () => {
    renderComponent(<Queue />, TEST_QUEUE);

    expect(screen.getByRole('list')).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    expect(getByText(listItems[0], 'Save a Secret for the Moon')).toBeInTheDocument();
    expect(getByText(listItems[0], 'The Magnetic Fields')).toBeInTheDocument();

    expect(getByText(listItems[1], 'Aquarius')).toBeInTheDocument();
    expect(getByText(listItems[1], 'Boards of Canada')).toBeInTheDocument();
  });

  test('clicking on a list item should play the song with corresponding index in the queue', () => {
    renderComponent(<Queue />, TEST_QUEUE);

    const aqariusListItem = screen.getAllByRole('listitem')[1];
    userEvent.click(getByRole(aqariusListItem, 'button'));

    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPlay).toHaveBeenCalledWith(1);
  });

  test('song currently playing in queue is styled with deepred-dark text, bold font, and pulse animation', () => {
    renderComponent(<Queue />, TEST_QUEUE, TEST_QUEUE[0]);

    const playingListItem = screen.getAllByRole('listitem')[0];
    const classListArray = [ ...playingListItem.classList ];
    expect(classListArray).toContain('text-deepred-dark');
    expect(classListArray).toContain('font-bold');
    expect(classListArray).toContain('animate-pulse');
  });

  test('song not currently playing in queue is not styled with deepred-dark text, bold font, nor pulse animation', () => {
    renderComponent(<Queue />, TEST_QUEUE, TEST_QUEUE[0]);

    const notPlayingListItem = screen.getAllByRole('listitem')[1];
    const classListArray = [ ...notPlayingListItem.classList ];
    expect(classListArray).not.toContain('text-deepred-dark');
    expect(classListArray).not.toContain('font-bold');
    expect(classListArray).not.toContain('animate-pulse');
  });

  test('if queue is empty renders no songs queued message', () => {
    renderComponent(<Queue />, []);

    expect(screen.getByText('You have no songs queued.')).toBeInTheDocument();
  });
});