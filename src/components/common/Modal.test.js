import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('modal functionality', () => {
  test('when not showing does not render children', () => {
    render(<Modal isShowing={false}><p data-testid="123456">hi</p></Modal>);

    expect(screen.queryByTestId('123456')).not.toBeInTheDocument();
  });

  test('renders children when showing', () => {
    render(<Modal isShowing={true}><p data-testid="123456">hi</p></Modal>);

    expect(screen.queryByTestId('123456')).toBeInTheDocument();
  });

  test('hitting the escape key calls onClose when modal is showing', () => {
    const mockCloseHandler = jest.fn();

    render(<Modal isShowing={true} onClose={mockCloseHandler}><p data-testid="123456">hi</p></Modal>);

    userEvent.type(screen.getByTestId('123456'), '{esc}');

    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test('hitting the escape key does not call onClose when modal is not showing', () => {
    const mockCloseHandler = jest.fn();

    const { container } = render(<Modal isShowing={false} onClose={mockCloseHandler}><p data-testid="123456">hi</p></Modal>);

    // have to test with fireEvent because userEvent type also involves a click (which will trigger the clickOutside handler)
    fireEvent.keyDown(container, { key: 'Escape', code: 'Escape' });

    expect(mockCloseHandler).toHaveBeenCalledTimes(0);
  });

  test('clicking outside of the modal will call onClose when modal is showing', () => {
    const mockCloseHandler = jest.fn();

    render(
      <div>
        <p data-testid="outside">outside</p>
        <Modal isShowing={true} onClose={mockCloseHandler}>
          <p data-testid="123456">hi</p>
        </Modal>
      </div>
    );

    userEvent.click(screen.getByTestId('outside'));

    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test('clicking outside of the modal will not call onClose when modal is not showing', () => {
    const mockCloseHandler = jest.fn();

    render(
      <div>
        <p data-testid="outside">outside</p>
        <Modal isShowing={false} onClose={mockCloseHandler}>
          <p data-testid="123456">hi</p>
        </Modal>
      </div>
    );

    userEvent.click(screen.getByTestId('outside'));

    expect(mockCloseHandler).toHaveBeenCalledTimes(0);
  });
});