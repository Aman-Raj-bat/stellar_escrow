import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateEscrow } from './CreateEscrow';
import { MemoryRouter } from 'react-router-dom';
import * as useWalletHook from '../hooks/useWallet';
import { factoryContract, ensureWalletConnection } from '../services/stellar';

// Mock dependencies
vi.mock('../hooks/useWallet');
vi.mock('../services/stellar', () => ({
  factoryContract: {
    create_escrow: vi.fn(),
  },
  ensureWalletConnection: vi.fn(),
}));

describe('CreateEscrow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and shows wallet prompt if not connected', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: null } as any);

    render(
      <MemoryRouter>
        <CreateEscrow />
      </MemoryRouter>
    );

    expect(screen.getByText('Create Escrow')).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText('G...'), {
      target: { value: 'GA7QYNF7SOWQ3GLR2B6RS22RCZB4Z2Z4YI2VMB7T4P2B6Y64K6T34K3Q' }
    });
    fireEvent.change(screen.getByPlaceholderText('100.00'), {
      target: { value: '100' }
    });

    // Attempt submit
    fireEvent.click(screen.getByRole('button', { name: /Lock Funds & Create Escrow/i }));
    await waitFor(() => {
      expect(screen.getByText('Please connect your wallet first.')).toBeInTheDocument();
    });
  });

  it('submits form successfully when connected', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);
    (ensureWalletConnection as any).mockResolvedValue(true);
    
    const mockSignAndSend = vi.fn().mockResolvedValue(true);
    (factoryContract.create_escrow as any).mockResolvedValue({
      result: { unwrap: () => 'C_NEW_ESCROW_ADDRESS' },
      signAndSend: mockSignAndSend
    });

    render(
      <MemoryRouter>
        <CreateEscrow />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('G...'), {
      target: { value: 'GA7QYNF7SOWQ3GLR2B6RS22RCZB4Z2Z4YI2VMB7T4P2B6Y64K6T34K3Q' }
    });

    fireEvent.change(screen.getByPlaceholderText('100.00'), {
      target: { value: '100' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Lock Funds & Create Escrow/i }));

    await waitFor(() => {
      expect(factoryContract.create_escrow).toHaveBeenCalledWith({
        client: 'G_CLIENT_ADDRESS',
        freelancer: 'GA7QYNF7SOWQ3GLR2B6RS22RCZB4Z2Z4YI2VMB7T4P2B6Y64K6T34K3Q',
        amount: BigInt(1000000000), // 100 XLM in stroops
        token: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEWBE6PJUXYN3TYM67HY4Z32D4Z4R6', // or default
      });
      expect(mockSignAndSend).toHaveBeenCalled();
    });
  });

  it('shows error for invalid address', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);

    render(
      <MemoryRouter>
        <CreateEscrow />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('G...'), {
      target: { value: 'INVALID_ADDRESS_FORMAT' }
    });

    fireEvent.change(screen.getByPlaceholderText('100.00'), {
      target: { value: '100' }
    });

    const form = screen.getByRole('button', { name: /Lock Funds & Create Escrow/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid Stellar address format.')).toBeInTheDocument();
    });
  });

  it('shows error for zero or negative amount', async () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT_ADDRESS' } as any);

    render(
      <MemoryRouter>
        <CreateEscrow />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('G...'), {
      target: { value: 'GA7QYNF7SOWQ3GLR2B6RS22RCZB4Z2Z4YI2VMB7T4P2B6Y64K6T34K3Q' }
    });

    fireEvent.change(screen.getByPlaceholderText('100.00'), {
      target: { value: '0' }
    });

    const form = screen.getByRole('button', { name: /Lock Funds & Create Escrow/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0.')).toBeInTheDocument();
    });
  });
});

