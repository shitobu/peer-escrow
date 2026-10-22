import React, { createContext, useContext, useState, useMemo } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface UnifiedWalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  isDemo: boolean;
  demoBalance: number;
  connectDemo: () => void;
  disconnectDemo: () => void;
  requestDemoAirdrop: () => void;
}

const UnifiedWalletContext = createContext<UnifiedWalletContextType>({
  publicKey: null,
  connected: false,
  isDemo: false,
  demoBalance: 10.0,
  connectDemo: () => {},
  disconnectDemo: () => {},
  requestDemoAirdrop: () => {},
});

const DEMO_PUBLIC_KEY = new PublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');

export const UnifiedWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const solanaWallet = useSolanaWallet();
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoBalance, setDemoBalance] = useState(10.0);

  const connectDemo = () => {
    setIsDemoActive(true);
  };

  const disconnectDemo = () => {
    setIsDemoActive(false);
  };

  const requestDemoAirdrop = () => {
    setDemoBalance((prev) => prev + 1.0);
  };

  const value = useMemo(() => {
    if (solanaWallet.connected && solanaWallet.publicKey) {
      return {
        publicKey: solanaWallet.publicKey,
        connected: true,
        isDemo: false,
        demoBalance,
        connectDemo,
        disconnectDemo,
        requestDemoAirdrop,
      };
    }

    if (isDemoActive) {
      return {
        publicKey: DEMO_PUBLIC_KEY,
        connected: true,
        isDemo: true,
        demoBalance,
        connectDemo,
        disconnectDemo,
        requestDemoAirdrop,
      };
    }

    return {
      publicKey: null,
      connected: false,
      isDemo: false,
      demoBalance,
      connectDemo,
      disconnectDemo,
      requestDemoAirdrop,
    };
  }, [solanaWallet.connected, solanaWallet.publicKey, isDemoActive, demoBalance]);

  return (
    <UnifiedWalletContext.Provider value={value}>
      {children}
    </UnifiedWalletContext.Provider>
  );
};

export const useUnifiedWallet = () => useContext(UnifiedWalletContext);
