import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';
import { ShieldAlert } from 'lucide-react';

describe('EmptyState', () => {
  it('renders default icon, title, and description correctly', () => {
    render(<EmptyState title="No Data" description="There is no data to display." />);
    
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('There is no data to display.')).toBeInTheDocument();
    
    // Lucide icons render SVG elements
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('renders custom icon when provided', () => {
    render(
      <EmptyState 
        title="Custom Icon" 
        description="Testing custom icon" 
        icon={<ShieldAlert data-testid="custom-icon" />} 
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <EmptyState 
        title="Styled State" 
        description="Testing styles" 
        className="custom-test-class"
      />
    );
    
    const container = screen.getByText('Styled State').parentElement;
    expect(container).toHaveClass('custom-test-class');
  });
});
