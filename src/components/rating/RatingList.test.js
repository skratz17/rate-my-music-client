import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { RatingList } from './RatingList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const RATINGS = [
  {
    "id": 3,
    "rating": 5,
    "review": "My favorite Magnetic Fields song.",
    "created_at": "2020-11-20T12:00:00Z",
    "rater": {
      "id": 2,
      "bio": "Just a cool boi.",
      "user": {
        "id": 2,
        "username": "jweckert17",
        "first_name": "Jacob",
        "last_name": "Eckert"
      }
    }
  },
  {
    "id": 4,
    "rating": 4,
    "review": "A banger of a song.",
    "created_at": "2020-11-22T12:00:00Z",
    "rater": {
      "id": 3,
      "bio": "Just a test boi.",
      "user": {
        "id": 3,
        "username": "test",
        "first_name": "Test",
        "last_name": "User"
      }
    }
  }
];

describe('rating list functionality', () => {
  test('renders rating list, username as link, review text, and rating', async () => {
    const history = renderComponent(<RatingList ratings={RATINGS} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('jweckert17');
    expect(links[1]).toHaveTextContent('test');

    await userEvent.click(links[0]);
    expect(history.location.pathname).toEqual('/profiles/2');

    await userEvent.click(links[1]);
    expect(history.location.pathname).toEqual('/profiles/3');

    expect(screen.getByText('My favorite Magnetic Fields song.')).toBeInTheDocument();
    expect(screen.getByText('A banger of a song.')).toBeInTheDocument();

    expect(screen.getByText('4 stars out of 5')).toBeInTheDocument();
    expect(screen.getByText('5 stars out of 5')).toBeInTheDocument();
  });
});