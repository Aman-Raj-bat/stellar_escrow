import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders the default loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a custom loading message', () => {
    render(<LoadingState message="Custom Loading" />);
    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });
});
