import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolana } from '../../../app/provider/SolanaContext';

/**
 * Хук для работы с кошельком
 * Показывает Solana кошелек из SDK
 */
export const useWallet = () => {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { walletState, connectWallet: connectSolana } = useSolana();
  const [copied, setCopied] = useState(false);

  const walletAddress = walletState.publicKey?.toBase58();
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

  const connect = useCallback(async () => {
    // Сначала логинимся через Privy
    if (!authenticated) {
      login();
    }
    // Потом подключаем Solana кошелек
    if (!walletState.connected) {
      await connectSolana();
    }
  }, [login, authenticated, walletState.connected, connectSolana]);

  const disconnect = useCallback(() => {
    logout();
  }, [logout]);

  return {
    // State
    ready,
    authenticated: authenticated && walletState.connected,
    walletAddress,
    shortAddress,
    copied,
    
    // Actions
    connect,
    disconnect,
    copyAddress,
  };
};
