import { render, screen } from '@testing-library/react';
import React from 'react';

import { FormControl } from './FormControl';

describe('renders proper controls based on type', () => {
  test('renders a basic text input', () => {
    render(<FormControl type="text" name="test" label="Test" />);

    const input = screen.getByLabelText("Test");
    expect(input.type).toEqual('text');
  });

  test('renders a password text input', () => {
    render(<FormControl name="test" label="Password" type="password" />);

    const input = screen.getByLabelText("Password");
    expect(input.type).toEqual('password');
  });

  test('renders a textarea', () => {
    render(<FormControl name="test" label="Textarea" type="textarea" />);

    const textarea = screen.getByLabelText("Textarea");
    expect(textarea.tagName).toEqual("TEXTAREA");
  });
});