import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { PlayerContext } from './PlayerProvider';
import { PlayerSeekControl } from './PlayerSeekControl';

let playerRef;

const renderComponent = (ui, contextValues) => {
  render(
    <PlayerContext.Provider value={contextValues}>
      {ui}
    </PlayerContext.Provider>
  );
};

describe('player seek control functionality', () => {
  beforeEach(() => {
    playerRef = {
      current: {
        seekTo: jest.fn()
      }
    }
  });

  test('if duration and elapsed are null, renders 0:00 as start time and -- as end time', () => {
    const context = {
      playerRef,
      elapsed: null,
      duration: null
    };

    renderComponent(<PlayerSeekControl />, context);

    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  test('if duration and elapsed are set, renders proper start and end values', () => {
    const context = {
      playerRef,
      elapsed: 0.2,
      duration: 20
    };

    renderComponent(<PlayerSeekControl />, context);

    expect(screen.getByText('0:04')).toBeInTheDocument();
    expect(screen.getByText('0:20')).toBeInTheDocument();
  });

  test('changing the value in the range input updates start time displayed', () => {
    const context = {
      playerRef,
      elapsed: 0.2,
      duration: 20
    };

    renderComponent(<PlayerSeekControl />, context);

    const seekControl = screen.getByRole('slider');
    fireEvent.mouseDown(seekControl);
    fireEvent.change(seekControl, { target: { value: '0.4' }});

    expect(screen.getByText('0:08')).toBeInTheDocument();
    expect(screen.getByText('0:20')).toBeInTheDocument();
  });

  test('changing the value in the range input does not call seekTo method of player until user releases mouse', () => {
    const context = {
      playerRef,
      elapsed: 0.2,
      duration: 20
    };

    renderComponent(<PlayerSeekControl />, context);

    const seekControl = screen.getByRole('slider');
    fireEvent.mouseDown(seekControl);
    fireEvent.change(seekControl, { target: { value: '0.4' }});

    expect(playerRef.current.seekTo).not.toHaveBeenCalled();
  });

  test('changing the value in the range input and then releasing the mouse does call the seekTo method of player with value selected', () => {
    const context = {
      playerRef,
      elapsed: 0.2,
      duration: 20
    };

    renderComponent(<PlayerSeekControl />, context);

    const seekControl = screen.getByRole('slider');
    fireEvent.mouseDown(seekControl);
    fireEvent.change(seekControl, { target: { value: '0.4' }});
    fireEvent.mouseUp(seekControl);

    expect(playerRef.current.seekTo).toHaveBeenCalledTimes(1);
    expect(playerRef.current.seekTo).toHaveBeenCalledWith(0.4, 'fraction');
  });
});