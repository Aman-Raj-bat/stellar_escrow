import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAllowed, setAllowed, getAddress } from '@stellar/freighter-api';

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (await isAllowed()) {
      const { address: userAddress, error } = await getAddress();
      if (!error && userAddress) {
        setAddress(userAddress);
      }
    }
  };

  const connect = async () => {
    await setAllowed();
    await checkConnection();
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
