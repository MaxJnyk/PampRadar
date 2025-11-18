import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';

/**
 * Хук для работы с кошельком
 * Инкапсулирует логику Privy и управление состоянием
 */
export const useWallet = () => {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [copied, setCopied] = useState(false);

  const walletAddress = user?.wallet?.address;
  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'No Wallet';

  const copyAddress = useCallback(() => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [walletAddress]);

  const connect = useCallback(() => {
    login();
  }, [login]);

  const disconnect = useCallback(() => {
    logout();
  }, [logout]);

  return {
    // State
    ready,
    authenticated,
    walletAddress,
    shortAddress,
    copied,
    
    // Actions
    connect,
    disconnect,
    copyAddress,
  };
};
