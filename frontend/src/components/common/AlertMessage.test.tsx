import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertMessage } from './AlertMessage';

describe('AlertMessage', () => {
  it('renders a success message correctly', () => {
    render(<AlertMessage type="success" message="Success Test" />);
    expect(screen.getByText('Success Test')).toBeInTheDocument();
  });

  it('renders an error message correctly', () => {
    render(<AlertMessage type="error" message="Error Test" />);
    expect(screen.getByText('Error Test')).toBeInTheDocument();
  });

  it('renders an info message correctly', () => {
    render(<AlertMessage type="info" message="Info Test" />);
    expect(screen.getByText('Info Test')).toBeInTheDocument();
  });
});
