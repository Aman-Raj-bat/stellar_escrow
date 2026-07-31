import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import * as useWalletHook from '../hooks/useWallet';
import { getEscrowContract } from '../services/stellar';

vi.mock('../hooks/useWallet');
vi.mock('../services/stellar', () => ({
  getEscrowContract: vi.fn(),
}));
vi.mock('../components/RecentActivity', () => ({
  RecentActivity: () => <div data-testid="recent-activity">Recent Activity Mock</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders disconnected state when wallet is not connected', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: null } as any);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Wallet Disconnected')).toBeInTheDocument();
    expect(screen.getByText(/Please connect your Freighter wallet/i)).toBeInTheDocument();
  });

  it('renders dashboard correctly when connected', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /New Escrow/i })).toBeInTheDocument();
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    expect(screen.getByText('No Escrow Selected')).toBeInTheDocument();
  });

  it('handles search successfully and displays escrow details', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);
    
    const mockSimulate = vi.fn().mockResolvedValue({
      result: {
        id: BigInt(1),
        client: 'G_CLIENT',
        freelancer: 'G_FREELANCER',
        amount: BigInt(5000000000), // 500 XLM
        status: { Created: {} }
      }
    });

    (getEscrowContract as any).mockReturnValue({
      get_escrow: vi.fn().mockResolvedValue({ simulate: mockSimulate })
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Escrow Address (C...)');
    fireEvent.change(searchInput, { target: { value: 'C_ESCROW_CONTRACT_ID' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(getEscrowContract).toHaveBeenCalledWith('C_ESCROW_CONTRACT_ID');
      expect(screen.getByText('Escrow #1')).toBeInTheDocument();
      expect(screen.getByText('Created')).toBeInTheDocument();
      expect(screen.getByText('500.00 XLM')).toBeInTheDocument();
    });
  });

  it('handles search error when escrow not found', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);
    
    const mockSimulate = vi.fn().mockResolvedValue({
      result: null
    });

    (getEscrowContract as any).mockReturnValue({
      get_escrow: vi.fn().mockResolvedValue({ simulate: mockSimulate })
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Escrow Address (C...)');
    fireEvent.change(searchInput, { target: { value: 'C_INVALID_ID' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText('Escrow not found.')).toBeInTheDocument();
    });
  });
});
