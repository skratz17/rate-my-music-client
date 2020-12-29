import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteButton } from './DeleteButton';

describe('delete button functionality', () => {
  test('renders as a single button with accessible name initially', () => {
    render(<DeleteButton accessibleName="Delete Me" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Delete Me')).toBeInTheDocument();
  });

  test('clicking on the button renders modal with delete warning, cancel, and delete buttons', async () => {
    render(<DeleteButton accessibleName="Delete Me" />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    expect(buttons[1]).toHaveTextContent('Cancel');
    expect(buttons[2]).toHaveTextContent('Delete Forever');
  });

  test('clicking the cancel button will close the modal and not call the delete handler', async () => {
    const mockDeleteHandler = jest.fn();

    render(<DeleteButton onDelete={mockDeleteHandler} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Cancel'));

    expect(await screen.findAllByRole('button')).toHaveLength(1);
    expect(mockDeleteHandler).not.toHaveBeenCalled();
  });

  test('clicking the delete button in the modal will close the modal and call the delete handler', async () => {
    const mockDeleteHandler = jest.fn();

    render(<DeleteButton onDelete={mockDeleteHandler} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Delete Forever'));

    expect(await screen.findAllByRole('button')).toHaveLength(1);
    expect(mockDeleteHandler).toHaveBeenCalledTimes(1);
  });
});