import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerErrorLog } from './PlayerErrorLog';
import { PlayerContext } from './PlayerProvider';

const renderComponent = (ui, contextValues) => {
  return render(
    <PlayerContext.Provider value={contextValues}>
      {ui}
    </PlayerContext.Provider>
  );
};

describe('player error log functionality', () => {
  test('renders list of error messages from context if error messages exist', () => {
    renderComponent(<PlayerErrorLog />, { errorQueue: [ 'Computer Error' ]});

    expect(screen.getByRole('list')).toBeInTheDocument();

    const listItem = screen.getByRole('listitem');
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveTextContent('Computer Error');
  });

  test('renders nothing if no error messages exist', () => {
    const { container } = renderComponent(<PlayerErrorLog />, { errorQueue: [] });

    expect(container.firstChild).toBeNull();
  });

  test('calls removeErrorMessage on click of error message', () => {
    const mockRemoveErrorMessage = jest.fn();
    
    renderComponent(<PlayerErrorLog />, { errorQueue: ['Message 1', 'Message 2'], removeErrorMessage: mockRemoveErrorMessage });

    const removeButtons = screen.getAllByRole('button');
    expect(removeButtons).toHaveLength(2);

    userEvent.click(removeButtons[0]);

    expect(mockRemoveErrorMessage).toHaveBeenCalledTimes(1);
    expect(mockRemoveErrorMessage).toHaveBeenCalledWith(0);
  });
});