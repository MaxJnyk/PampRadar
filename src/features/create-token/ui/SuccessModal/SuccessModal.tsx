import React from 'react';
import { IonModal } from '@ionic/react';
import './SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
  transactionSignature: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  tokenAddress,
  transactionSignature,
}) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);
  const [copiedTx, setCopiedTx] = React.useState(false);
  
  const explorerUrl = `https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`;
  const txUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`;

  const copyToClipboard = (text: string, type: 'address' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="success-modal">
      <div className="success-wrapper">
        <div className="success-header">
          <h1>Token Created!</h1>
          <button className="close-x" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div className="success-container">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#42BABE" strokeWidth="4"/>
              <path d="M25 40L35 50L55 30" stroke="#42BABE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Congratulations!</h2>
          <p>Your token has been successfully created on Solana</p>

          <div className="info-block">
            <label>Token Address</label>
            <div className="address-row">
              <code>{tokenAddress.slice(0, 8)}...{tokenAddress.slice(-8)}</code>
              <button onClick={() => copyToClipboard(tokenAddress, 'address')} className={copiedAddress ? 'copied' : ''}>
                {copiedAddress ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="info-block">
            <label>Transaction</label>
            <div className="address-row">
              <code>{transactionSignature.slice(0, 8)}...{transactionSignature.slice(-8)}</code>
              <button onClick={() => copyToClipboard(transactionSignature, 'tx')} className={copiedTx ? 'copied' : ''}>
                {copiedTx ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="actions">
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="explorer-btn">
              View on Explorer
            </a>
            <a href={txUrl} target="_blank" rel="noopener noreferrer" className="explorer-btn">
              View Transaction
            </a>
          </div>

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </IonModal>
  );
};
