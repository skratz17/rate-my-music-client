import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListPage } from './ListPage';
import { api } from '../../api';
import { PlayerContext } from '../player/PlayerProvider';
import { UserContext } from '../user/UserProvider';

jest.mock('../../api');
const mockGetList = (api.lists.get = jest.fn());

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(
    <UserContext.Provider value={{ user: { id: 2 } }}>
      <PlayerContext.Provider value={{ setQueue: jest.fn() }}>
        <Router history={history}>
          {ui}
        </Router>
      </PlayerContext.Provider>
    </UserContext.Provider>
  );

  return history;
};

describe('list page functionality', () => {
  test('should get list by id on load', async () => {
    await waitFor(() => renderComponent(<ListPage listId={8} />));

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(8);
  });
});