import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from '../InputField';

describe('InputField', () => {
  it('renders with basic props', () => {
    render(
      <InputField
        label="Test Label"
        placeholder="Test placeholder"
        data-testid="input-field"
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<InputField label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles controlled input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <InputField
        label="Controlled Input"
        value="initial"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Controlled Input');
    await user.clear(input);
    await user.type(input, 'new value');

    expect(handleChange).toHaveBeenCalled();
  });

  it('validates required field', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Required Field"
        rules={[{ required: true, message: 'This field is required' }]}
      />
    );

    const input = screen.getByLabelText('Required Field');
    await user.click(input);
    await user.tab(); // blur the input

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Email"
        type="email"
        rules={[
          { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
        ]}
      />
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    
    render(<InputField label="Password" type="password" />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles disabled state', () => {
    render(<InputField label="Disabled Input" disabled />);
    const input = screen.getByLabelText('Disabled Input');
    expect(input).toBeDisabled();
  });

  it('handles readonly state', () => {
    render(<InputField label="Readonly Input" readonly />);
    const input = screen.getByLabelText('Readonly Input');
    expect(input).toHaveAttribute('readonly');
  });

  it('shows helper text', () => {
    render(
      <InputField
        label="Input with Help"
        helperText="This is helpful text"
      />
    );
    expect(screen.getByText('This is helpful text')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <InputField
        label="Input with Error"
        error="Something went wrong"
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onEnter when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const handleEnter = vi.fn();
    
    render(
      <InputField
        label="Enter Test"
        onEnter={handleEnter}
      />
    );

    const input = screen.getByLabelText('Enter Test');
    await user.type(input, 'test value');
    await user.keyboard('{Enter}');

    expect(handleEnter).toHaveBeenCalledWith('test value', expect.any(Object));
  });

  it('applies custom className', () => {
    render(
      <InputField
        label="Custom Class"
        className="custom-input"
        data-testid="input-container"
      />
    );
    const container = screen.getByTestId('input-container');
    expect(container).toHaveClass('custom-input');
  });

  it('renders with prefix and suffix', () => {
    render(
      <InputField
        label="With Addons"
        prefix={<span>$</span>}
        suffix={<span>USD</span>}
      />
    );
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('handles different sizes', () => {
    const { rerender } = render(
      <InputField label="Size Test" size="sm" data-testid="container" />
    );
    expect(screen.getByTestId('container')).toHaveClass('input-field--sm');

    rerender(
      <InputField label="Size Test" size="lg" data-testid="container" />
    );
    expect(screen.getByTestId('container')).toHaveClass('input-field--lg');
  });

  it('handles different variants', () => {
    const { rerender } = render(
      <InputField label="Variant Test" variant="outline" data-testid="container" />
    );
    expect(screen.getByTestId('container')).toHaveClass('input-field--outline');

    rerender(
      <InputField label="Variant Test" variant="filled" data-testid="container" />
    );
    expect(screen.getByTestId('container')).toHaveClass('input-field--filled');
  });
});