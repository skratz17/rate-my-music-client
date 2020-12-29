import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { YearSelect } from './YearSelect';

describe('year select functionality', () => {
  test('renders all years from 1850 to current year as options, reverse chronologically', () => {
    render(<YearSelect />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    expect(select).toHaveValue('');
    expect(select).toHaveDisplayValue('any');

    const options = [ ...select.options ];
    const currentYear = (new Date()).getFullYear();
    const expectedOptions = [ '' ];
    for(let i = currentYear; i >= 1850; i--) expectedOptions.push(String(i));

    expect(expectedOptions.length).toEqual(options.length);

    for(let i = 0; i < expectedOptions.length; i++) {
      expect(expectedOptions[i]).toEqual(options[i].value);
    }
  });

  test('calls onChange when user selects a value', () => {
    const mockChangeHandler = jest.fn();
    render(<YearSelect onChange={mockChangeHandler} />);

    userEvent.selectOptions(screen.getByRole('combobox'), '1994');
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});