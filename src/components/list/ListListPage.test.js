import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { ListListPage } from './ListListPage';
import { api } from '../../api';

const mockListLists = (api.lists.list = jest.fn());

describe('list list page functionality', () => {
  test('fetches all lists on page load', async () => {
    await waitFor(() => render(<ListListPage />));

    expect(mockListLists).toHaveBeenCalledTimes(1);
    expect(mockListLists).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10
    });
  });
});