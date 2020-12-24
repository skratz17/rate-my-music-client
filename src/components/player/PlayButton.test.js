import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayButton } from './PlayButton';
import { PlayerContext } from './PlayerProvider';

const mockSetQueue = jest.fn();
const mockPlayQueue = jest.fn();

const renderComponent = ui => {
  render(
    <PlayerContext.Provider value={{ setQueue: mockSetQueue, playQueue: mockPlayQueue }}>
      { ui }
    </PlayerContext.Provider>
  );
};

describe('play button functionality', () => {
  test('should render as a button with accesible text that queues songs when clicked', async () => {
    renderComponent(
      <PlayButton accessibleName="Play All Magnetic Fields Songs" 
        songs={[ { id: 1, name: 'Save a Secret for the Moon' }]} />
      );

    expect(screen.getByRole('button')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Play All Magnetic Fields Songs'));
    expect(mockSetQueue).toHaveBeenCalledTimes(1);
    expect(mockSetQueue).toHaveBeenLastCalledWith([ { id: 1, name: 'Save a Secret for the Moon' } ]);
    expect(mockPlayQueue).toHaveBeenCalledTimes(1);
  });
});