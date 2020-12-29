import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { LinkButton } from './LinkButton';

const renderComponent = ui => {
  const history = createMemoryHistory();
  history.push('/');

  render(<Router history={history}>{ui}</Router>);

  return history;
};

describe('LinkButton functionality', () => {
  test('renders as a Link to the specific url', () => {
    const history = renderComponent(<LinkButton to="/test">Link Text</LinkButton>);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.textContent).toEqual('Link Text')

    userEvent.click(link);

    expect(history.location.pathname).toEqual('/test');
  });
});