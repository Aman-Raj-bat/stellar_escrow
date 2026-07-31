import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EscrowDetail } from './EscrowDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as useWalletHook from '../hooks/useWallet';
import * as useEscrowHook from '../hooks/useEscrow';

vi.mock('../hooks/useWallet');
vi.mock('../hooks/useEscrow');
vi.mock('../components/ActivityTimeline', () => ({
  ActivityTimeline: () => <div data-testid="activity-timeline">Timeline Mock</div>,
}));

const renderWithRouter = (ui: React.ReactNode, id: string = 'test-id') => {
  return render(
    <MemoryRouter initialEntries={[`/escrow/${id}`]}>
      <Routes>
        <Route path="/escrow/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EscrowDetail', () => {
  const mockDeposit = vi.fn();
  const mockAccept = vi.fn();
  const mockRelease = vi.fn();
  const mockRefund = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows invalid ID message if no ID', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({ escrow: null } as any);

    render(
      <MemoryRouter initialEntries={['/escrow/']}>
        <Routes>
          <Route path="/escrow" element={<EscrowDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Invalid Escrow ID')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({
      escrow: null,
      isLoading: true,
      error: null,
      txHash: null,
      currentStatus: undefined,
      deposit: mockDeposit,
      accept: mockAccept,
      release: mockRelease,
      refund: mockRefund,
    } as any);

    renderWithRouter(<EscrowDetail />);
    expect(screen.getByText('Loading escrow details...')).toBeInTheDocument();
  });

  it('renders client view in Created state and shows Deposit button', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({
      escrow: { client: 'G_CLIENT', freelancer: 'G_FREELANCER', amount: BigInt(5000000000), token: 'TOKEN' },
      isLoading: false,
      error: null,
      txHash: null,
      currentStatus: 'Created',
      deposit: mockDeposit,
      accept: mockAccept,
      release: mockRelease,
      refund: mockRefund,
    } as any);

    renderWithRouter(<EscrowDetail />);
    expect(screen.getByText('Created')).toBeInTheDocument();
    
    const depositBtn = screen.getByRole('button', { name: /Deposit Funds/i });
    expect(depositBtn).toBeInTheDocument();
    fireEvent.click(depositBtn);
    expect(mockDeposit).toHaveBeenCalled();
  });

  it('renders freelancer view in Funded state and shows Accept/Refund buttons', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_FREELANCER' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({
      escrow: { client: 'G_CLIENT', freelancer: 'G_FREELANCER', amount: BigInt(5000000000), token: 'TOKEN' },
      isLoading: false,
      error: null,
      txHash: null,
      currentStatus: 'Funded',
      deposit: mockDeposit,
      accept: mockAccept,
      release: mockRelease,
      refund: mockRefund,
    } as any);

    renderWithRouter(<EscrowDetail />);
    expect(screen.getByText('Funded')).toBeInTheDocument();
    
    const acceptBtn = screen.getByRole('button', { name: /Accept Escrow/i });
    const refundBtn = screen.getByRole('button', { name: /Refund Client/i });
    
    expect(acceptBtn).toBeInTheDocument();
    expect(refundBtn).toBeInTheDocument();
    
    fireEvent.click(acceptBtn);
    expect(mockAccept).toHaveBeenCalled();
  });

  it('renders client view in Accepted state and shows Release button', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({
      escrow: { client: 'G_CLIENT', freelancer: 'G_FREELANCER', amount: BigInt(5000000000), token: 'TOKEN' },
      isLoading: false,
      error: null,
      txHash: null,
      currentStatus: 'Accepted',
      deposit: mockDeposit,
      accept: mockAccept,
      release: mockRelease,
      refund: mockRefund,
    } as any);

    renderWithRouter(<EscrowDetail />);
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    
    const releaseBtn = screen.getByRole('button', { name: /Release Funds to Freelancer/i });
    expect(releaseBtn).toBeInTheDocument();
    fireEvent.click(releaseBtn);
    expect(mockRelease).toHaveBeenCalled();
  });

  it('disables buttons while processing (isLoading)', () => {
    vi.spyOn(useWalletHook, 'useWallet').mockReturnValue({ address: 'G_CLIENT' } as any);
    vi.spyOn(useEscrowHook, 'useEscrow').mockReturnValue({
      escrow: { client: 'G_CLIENT', freelancer: 'G_FREELANCER', amount: BigInt(5000000000), token: 'TOKEN' },
      isLoading: true, // Processing
      error: null,
      txHash: null,
      currentStatus: 'Created',
      deposit: mockDeposit,
      accept: mockAccept,
      release: mockRelease,
      refund: mockRefund,
    } as any);

    renderWithRouter(<EscrowDetail />);
    const depositBtn = screen.getByRole('button');
    expect(depositBtn).toBeDisabled();
  });
});
