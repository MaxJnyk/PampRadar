import React, { memo } from 'react';
import { useWallet } from '../model/useWallet';
import { WalletIcon, LogoutIcon, CardIcon } from './icons';
import './WalletButton.css';

/**
 * Кнопка подключения/управления кошельком
 * Показывает разные состояния: loading, connected, disconnected
 */
export const WalletButton: React.FC = memo(() => {
  const { ready, authenticated, connecting, shortAddress, copied, connect, disconnect, copyAddress } = useWallet();

  // Loading state
  if (!ready) {
    return (
      <button className="wallet-button wallet-button-loading" disabled>
        <span className="wallet-button-text">Loading...</span>
      </button>
    );
  }

  // Connected state
  if (authenticated) {
    return (
      <div className="wallet-button-group">
        <button 
          onClick={copyAddress}
          className="wallet-button wallet-button-connected"
          title="Click to copy address"
        >
          <CardIcon />
          <span className="wallet-button-text">
            {copied ? '✓ Copied!' : shortAddress}
          </span>
        </button>
        <button 
          onClick={disconnect}
          className="wallet-button wallet-button-disconnect"
          title="Disconnect wallet"
        >
          <LogoutIcon />
        </button>
      </div>
    );
  }

  // Connecting state - show skeleton placeholder
  if (connecting) {
    return (
      <div className="wallet-button-group">
        <div className="wallet-button wallet-button-connecting">
          <div className="wallet-skeleton-icon"></div>
          <span className="wallet-skeleton-text"></span>
        </div>
      </div>
    );
  }

  // Disconnected state
  return (
    <button 
      onClick={connect}
      className="wallet-button wallet-button-primary"
    >
      <WalletIcon />
      <span className="wallet-button-text">Connect Wallet</span>
    </button>
  );
});

WalletButton.displayName = 'WalletButton';
