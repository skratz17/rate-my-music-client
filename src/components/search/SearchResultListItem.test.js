import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { SearchResultListItem } from './SearchResultListItem';

const renderComponent = ui => {
  const history = createMemoryHistory();

  render(<Router history={history}>{ui}</Router>);

  return history;
};

describe('search result list item functionality', () => {
  test('renders as a list item with link to to prop', () => {
    const history = renderComponent(<SearchResultListItem to="/artists/3" />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();

    userEvent.click(link);
    expect(history.location.pathname).toEqual('/artists/3');
  });

  test('renders props.children as child of listitem', () => {
    renderComponent(<SearchResultListItem to="/"><span>test</span></SearchResultListItem>);

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});