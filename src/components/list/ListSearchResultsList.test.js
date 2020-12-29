import React from 'react';
import { render, screen, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { ListSearchResultsList } from './ListSearchResultsList';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

const LISTS = [
  { 
    id: 1, 
    name: 'My Favorite Songs',
    creator: {
      user: {
        username: 'jweckert17'
      }
    },
    favCount: 3
  } 
];

describe('list search results list functionality', () => {
  test('renders list of lists with link to list page, list name text, list creator text, and favorites count', () => {
    const history = renderComponent(<ListSearchResultsList lists={LISTS} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItem = screen.getByRole('listitem');

    expect(listItem).toBeInTheDocument();

    expect(getByText(listItem, 'My Favorite Songs')).toBeInTheDocument();
    expect(getByText(listItem, 'by jweckert17')).toBeInTheDocument();
    expect(getByText(listItem, /3*favorites/)).toBeInTheDocument();

    userEvent.click(screen.getByRole('link'));

    expect(history.location.pathname).toEqual('/lists/1');
  });
});