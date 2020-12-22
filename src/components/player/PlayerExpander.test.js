import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerExpander } from './PlayerExpander';
import { PlayerContext } from './PlayerProvider';

const renderComponent = (ui, isPlaying = false) => {
  render(
    <PlayerContext.Provider value={{ isPlaying }}>
      {ui}
    </PlayerContext.Provider>
  );
};

describe('player expander functionality', () => {
  test('displays collapsed by default', () => {
    renderComponent(<PlayerExpander />);
    
    expect(screen.getByText('Expand Player')).toBeInTheDocument();
  });

  test('user can expand or collapse the player with the button', async () => {
    renderComponent(<PlayerExpander />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Expand Player');

    await userEvent.click(button);
    expect(button).toHaveTextContent('Collapse Player');

    await userEvent.click(button);
    expect(button).toHaveTextContent('Expand Player');
  });
});