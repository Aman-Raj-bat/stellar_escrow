import '@testing-library/jest-dom';
import { vi } from 'vitest';

import { Buffer } from 'buffer';

// Mock the window.Buffer which is needed by stellar-sdk
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Mock StellarWalletsKit
vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    init: vi.fn(),
    getAddress: vi.fn().mockResolvedValue({ address: 'G_MOCK_ADDRESS' }),
    signTransaction: vi.fn().mockResolvedValue('signed_xdr'),
  },
  Networks: {
    TESTNET: 'TESTNET',
    PUBLIC: 'PUBLIC',
  },
}));

// Mock Modules
vi.mock('@creit.tech/stellar-wallets-kit/modules/freighter', () => ({
  FreighterModule: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit/modules/xbull', () => ({
  xBullModule: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit/modules/albedo', () => ({
  AlbedoModule: vi.fn(),
}));
