import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerContext } from './PlayerProvider';
import { PlayerControls } from './PlayerControls';

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSkip = jest.fn();
const mockCurrentSong = {
  name: 'Save a Secret for the Moon',
  artist: {
    name: 'The Magnetic Fields'
  }
};

const renderComponent = (ui, currentSong = mockCurrentSong, isPlaying = false) => {
  render(
    <PlayerContext.Provider value={{
      play: mockPlay,
      pause: mockPause,
      skip: mockSkip,
      currentSong,
      isPlaying}}>{ui}</PlayerContext.Provider>
  );
};

describe('player controls functionality', () => {
  test('renders song and artist info if current song set', () => {
    renderComponent(<PlayerControls />);

    expect(screen.getByText('Save a Secret for the Moon')).toBeInTheDocument();
    expect(screen.getByText('The Magnetic Fields')).toBeInTheDocument();
  });

  test('renders no songs queued message if no current song', () => {
    renderComponent(<PlayerControls />, null);

    expect(screen.getByText('No songs have been queued.')).toBeInTheDocument();
  });

  test('renders play button if current song set and not playing', () => {
    renderComponent(<PlayerControls />);

    expect(screen.getByText('Play Save a Secret for the Moon')).toBeInTheDocument();
  });

  test('renders pause button if current song set and playing', () => {
    renderComponent(<PlayerControls />, mockCurrentSong, true);

    expect(screen.getByText('Pause Save a Secret for the Moon')).toBeInTheDocument();
  });

  test('clicking previous will call skip function with -1', async () => {
    renderComponent(<PlayerControls />);

    await userEvent.click(screen.getByText('Previous Song'));
    expect(mockSkip).toHaveBeenCalledTimes(1);
    expect(mockSkip).toHaveBeenCalledWith(-1);
  });

  test('clicking next will call skip function with 1', async () => {
    renderComponent(<PlayerControls />);

    await userEvent.click(screen.getByText('Next Song'));
    expect(mockSkip).toHaveBeenCalledTimes(1);
    expect(mockSkip).toHaveBeenCalledWith(1);
  });

  test('clicking play will call play function', async () => {
    renderComponent(<PlayerControls />);

    await userEvent.click(screen.getByText('Play Save a Secret for the Moon'));
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('clicking pause will call pause function', async () => {
    renderComponent(<PlayerControls />, mockCurrentSong, true);

    await userEvent.click(screen.getByText('Pause Save a Secret for the Moon'));
    expect(mockPause).toHaveBeenCalledTimes(1);
  });
});