import React from 'react';
import { render, screen } from '@testing-library/react';

import { api } from '../../api';
import { ListEditForm } from './ListEditForm';

jest.mock('../../api');
const mockGetList = (api.lists.get = jest.fn());

const listApiResponse = {
  "id": 2,
  "name": "TEST",
  "description": "TEST FROM FORM",
  "songs": [
      {
          "id": 3,
          "song": {
              "id": 3,
              "name": "Save a Secret for the Moon",
              "year": 1996,
              "artist": {
                  "id": 2,
                  "name": "The Magnetic Fields",
              },
              "sources": [
                  {
                      "id": 3,
                      "url": "https://www.youtube.com/watch?v=4rk_9cYOp8A",
                      "service": "YouTube",
                      "is_primary": true,
                      "song": 3
                  }
              ]
          },
          "description": "Probably my favorite song from Get Lost."
      },
  ],
  "creator": {
    "id": 3,
    "bio": "Just a test boi.",
    "user": {
        "id": 3,
        "username": "test",
        "first_name": "Test",
        "last_name": "User"
    }
  },
  "fav_count": 0
};

describe('list edit form functionality', () => {
  test('fetches list with id passed in props on load and renders edit form with list data prepopulated', async () => {
    mockGetList.mockResolvedValueOnce(listApiResponse);

    render(<ListEditForm listId={2} />);

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(2);

    expect(await screen.findByRole('form')).toBeInTheDocument();

    expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('TEST'));
    expect(screen.getByLabelText('Description')).toEqual(screen.getByDisplayValue('TEST FROM FORM'));
    expect(screen.getByText('Clear Song')).toBeInTheDocument();
    expect(screen.getByText('Save a Secret for the Moon')).toBeInTheDocument();
    expect(screen.getByLabelText('Song Description')).toEqual(screen.getByDisplayValue('Probably my favorite song from Get Lost.'));
  });

  test('renders error message and no form if list load error', async () => {
    mockGetList.mockRejectedValueOnce({ message: 'List load failed.' });

    render(<ListEditForm listId={2} />);

    expect(await screen.findByText('List load failed.')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});