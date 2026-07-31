import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWallet } from './useWallet';
import { WalletProvider } from '../store/WalletContext';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    init: vi.fn(),
    getAddress: vi.fn(),
    authModal: vi.fn(),
    disconnect: vi.fn(),
  },
}));

describe('useWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws error if used outside WalletProvider', () => {
    // Suppress console.error for expected thrown error
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    expect(() => {
      renderHook(() => useWallet());
    }).toThrow('useWallet must be used within WalletProvider');

    spy.mockRestore();
  });

  it('provides null address initially if not connected', async () => {
    (StellarWalletsKit.getAddress as any).mockRejectedValue(new Error('Not connected'));
    
    const { result } = renderHook(() => useWallet(), { wrapper: WalletProvider });
    
    expect(result.current.address).toBeNull();
  });

  it('connects and sets address successfully', async () => {
    (StellarWalletsKit.getAddress as any).mockRejectedValue(new Error('Not connected'));
    (StellarWalletsKit.authModal as any).mockResolvedValue({ address: 'G_TEST_ADDRESS' });

    const { result } = renderHook(() => useWallet(), { wrapper: WalletProvider });

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.address).toBe('G_TEST_ADDRESS');
  });

  it('handles wallet rejection gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (StellarWalletsKit.getAddress as any).mockRejectedValue(new Error('Not connected'));
    (StellarWalletsKit.authModal as any).mockRejectedValue(new Error('User rejected'));

    const { result } = renderHook(() => useWallet(), { wrapper: WalletProvider });

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.address).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Wallet modal closed or error:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('disconnects successfully', async () => {
    (StellarWalletsKit.getAddress as any).mockResolvedValue({ address: 'G_INITIAL_ADDRESS' });
    (StellarWalletsKit.disconnect as any).mockResolvedValue(true);

    const { result } = renderHook(() => useWallet(), { wrapper: WalletProvider });

    // Wait for the initial effect to resolve the address
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.address).toBe('G_INITIAL_ADDRESS');

    await act(async () => {
      await result.current.disconnect();
    });

    expect(result.current.address).toBeNull();
    expect(StellarWalletsKit.disconnect).toHaveBeenCalled();
  });
});
