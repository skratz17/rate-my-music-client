import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerContainer } from './PlayerContainer';
import { PlayerContext } from './PlayerProvider';

const mockSetPlayerRef = jest.fn();

const renderComponent = (ui, isPlaying = false) => {
  return render(
    <PlayerContext.Provider value={{ isPlaying, setPlayerRef: mockSetPlayerRef }}>
      {ui}
    </PlayerContext.Provider>
  );
};

describe('player expander functionality', () => {
  test('displays collapsed by default', () => {
    renderComponent(<PlayerContainer />);
    
    expect(screen.getAllByText('Expand Player')).toHaveLength(2);
  });

  test('user can expand or collapse the player with the RMM Player text button', () => {
    renderComponent(<PlayerContainer />);

    const button = screen.getAllByRole('button')[1];
    expect(button).toHaveTextContent('Expand Player');

    userEvent.click(button);
    expect(button).toHaveTextContent('Collapse Player');

    userEvent.click(button);
    expect(button).toHaveTextContent('Expand Player');
  });

  test('user can expand or collapse the player with the arrow button', () => {
    renderComponent(<PlayerContainer />);

    const button = screen.getAllByRole('button')[2];
    expect(button).toHaveTextContent('Expand Player');

    userEvent.click(button);
    expect(button).toHaveTextContent('Collapse Player');

    userEvent.click(button);
    expect(button).toHaveTextContent('Expand Player');
  });

  test('user can expand or collapse the queue with the queue button', () => {
    renderComponent(<PlayerContainer />);

    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent('Show Queue');

    userEvent.click(button);
    expect(button).toHaveTextContent('Hide Queue');

    userEvent.click(button);
    expect(button).toHaveTextContent('Show Queue');
  });

  test('user can close queue with the close button rendered within the queue wrapper', () => {
    renderComponent(<PlayerContainer />);

    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent('Show Queue');

    userEvent.click(button);

    const queueCloseButton = screen.getAllByRole('button')[3];
    expect(button).toHaveTextContent('Hide Queue');
    expect(queueCloseButton).toBeInTheDocument();
    expect(queueCloseButton).toHaveTextContent('Hide Queue');

    userEvent.click(queueCloseButton);

    expect(queueCloseButton).not.toBeInTheDocument();

    expect(button).toHaveTextContent('Show Queue');
  });

  test('user can close queue with escape key', () => {
    const { container } = renderComponent(<PlayerContainer />);

    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent('Show Queue');

    userEvent.click(button);
    expect(button).toHaveTextContent('Hide Queue');

    userEvent.type(container, '{esc}');

    expect(button).toHaveTextContent('Show Queue');
  });
});