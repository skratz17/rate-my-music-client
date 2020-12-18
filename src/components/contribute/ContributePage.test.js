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
  test('should render two links to add new artist and song', () => {
    renderComponent();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0].textContent).toEqual("Create a New Artist");
    expect(links[1].textContent).toEqual("Create a New Song");
  });

  test('clicking on new artist link navigates to /artists/new', async () => {
    const history = renderComponent();

    await userEvent.click(screen.getByText("Create a New Artist"));

    expect(history.location.pathname).toEqual('/artists/new');
  });

  test('clicking on new song link navigates to /songs/new', async () => {
    const history = renderComponent();

    await userEvent.click(screen.getByText("Create a New Song"));

    expect(history.location.pathname).toEqual('/songs/new');
  });
});