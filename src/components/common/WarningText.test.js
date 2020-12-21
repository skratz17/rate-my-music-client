import { render, screen } from '@testing-library/react';
import React from 'react';

import { WarningText } from './WarningText';

describe('warning text functionality', () => {
  test('renders warning message if passed as child', () => {
    render(<WarningText>Warning</WarningText>);

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  test('renders nothing when falsy values are passed', () => {
    const { container } = render(<>
      <WarningText></WarningText>
      <WarningText>{undefined}</WarningText>
      <WarningText>{null}</WarningText>
    </>);

    expect(container).toBeEmptyDOMElement();
  });
});