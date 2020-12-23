import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { ListPage } from './ListPage';
import { api } from '../../api';
import { PlayerContext } from '../player/PlayerProvider';

jest.mock('../../api');
const mockGetList = (api.lists.get = jest.fn());

const renderComponent = ui => {
  render(
    <PlayerContext.Provider value={{ setQueue: jest.fn() }}>
      {ui}
    </PlayerContext.Provider>
  )
};

describe('list page functionality', () => {
  test('should get list by id on load', async () => {
    await waitFor(() => renderComponent(<ListPage listId={8} />));

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(8);
  });
});