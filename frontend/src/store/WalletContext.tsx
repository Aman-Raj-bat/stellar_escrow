/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import '../services/stellar';

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      const { address: userAddress } = await StellarWalletsKit.getAddress();
      if (userAddress) {
        setAddress(userAddress);
      }
    } catch {
      // Not connected, keep address null
      setAddress(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      const { address: userAddress } = await StellarWalletsKit.authModal();
      if (userAddress) {
        setAddress(userAddress);
      }
    } catch (e) {
      console.error('Wallet modal closed or error:', e);
    }
  };

  const disconnect = async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // ignore
    }
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

