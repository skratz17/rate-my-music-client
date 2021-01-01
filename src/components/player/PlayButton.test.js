import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayButton } from './PlayButton';
import { PlayerContext } from './PlayerProvider';

const mockUpdateQueue = jest.fn();

const renderComponent = ui => {
  render(
    <PlayerContext.Provider value={{ updateQueue: mockUpdateQueue }}>
      { ui }
    </PlayerContext.Provider>
  );
};

describe('play button functionality', () => {
  test('should render as a button with accesible text that queues songs when clicked', () => {
    renderComponent(
      <PlayButton accessibleName="Play All Magnetic Fields Songs" 
        songs={[ { id: 1, name: 'Save a Secret for the Moon' }]} />
      );

    expect(screen.getByRole('button')).toBeInTheDocument();

    userEvent.click(screen.getByText('Play All Magnetic Fields Songs'));
    expect(mockUpdateQueue).toHaveBeenCalledTimes(1);
    expect(mockUpdateQueue).toHaveBeenLastCalledWith([ { id: 1, name: 'Save a Secret for the Moon' } ]);
  });
});