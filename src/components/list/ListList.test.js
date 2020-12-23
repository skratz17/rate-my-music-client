import React from 'react';
import { render, screen, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListList } from './ListList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const LISTS = [
  {
    "id": 1,
    "name": "My favorite songs",
    "description": "Here are a few of my favorite tunes",
    "creator": {
      "id": 2,
      "bio": "Just a cool boi.",
      "user": {
        "id": 2,
        "username": "jweckert17",
        "firstName": "Jacob",
        "lastName": "Eckert"
      }
    },
    "favCount": 1
  },
  {
    "id": 2,
    "name": "TEST",
    "description": "TEST FROM FORM",
    "creator": {
      "id": 3,
      "bio": "Just a test boi.",
      "user": {
        "id": 3,
        "username": "test",
        "firstName": "Test",
        "lastName": "User"
      }
    },
    "favCount": 0
  }
];

describe('list list functionality', () => {
  test('renders listitem for each list, with data on list rendered', () => {
    renderComponent(<ListList lists={LISTS} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    
    expect(getByText(listItems[0], 'My favorite songs')).toBeInTheDocument();
    expect(getByText(listItems[0], 'by jweckert17')).toBeInTheDocument();
    expect(getByText(listItems[0], /1*favorites/)).toBeInTheDocument();

    expect(getByText(listItems[1], 'TEST')).toBeInTheDocument();
    expect(getByText(listItems[1], 'by test')).toBeInTheDocument();
    expect(getByText(listItems[1], /0*favorites/)).toBeInTheDocument();
  });

  test('renders link for each list that links to list page', async () => {
    const history = renderComponent(<ListList lists={LISTS} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveTextContent('My favorite songs Page');
    expect(links[1]).toHaveTextContent('TEST Page');

    await userEvent.click(links[0]);
    expect(history.location.pathname).toEqual('/lists/1');

    await userEvent.click(links[1]);
    expect(history.location.pathname).toEqual('/lists/2');
  });

  test('renders no lists to display text if empty list', () => {
    renderComponent(<ListList lists={[]} />);

    expect(screen.getByText('There are no lists to display.')).toBeInTheDocument();
  });
});