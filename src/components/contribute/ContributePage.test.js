import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { ContributePage } from './ContributePage';

const renderComponent = () => {
  const history = createMemoryHistory();
  history.push('/contribute');

  render(
    <Router history={history}>
      <ContributePage />
    </Router>
  );

  return history;
};

describe('contribute page basic rendering', () => {
  test('should render three links to add new artist, song, and list', () => {
    renderComponent();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveTextContent("Create a New Artist");
    expect(links[1]).toHaveTextContent("Create a New Song");
    expect(links[2]).toHaveTextContent("Create a New List");
  });

  test('clicking on new artist link navigates to /artists/new', () => {
    const history = renderComponent();

    userEvent.click(screen.getByText("Create a New Artist"));

    expect(history.location.pathname).toEqual('/artists/new');
  });

  test('clicking on new song link navigates to /songs/new', () => {
    const history = renderComponent();

    userEvent.click(screen.getByText("Create a New Song"));

    expect(history.location.pathname).toEqual('/songs/new');
  });

  test('clicking on new list link navigates to /lists/new', () => {
    const history = renderComponent();

    userEvent.click(screen.getByText("Create a New List"));

    expect(history.location.pathname).toEqual('/lists/new');
  });
});