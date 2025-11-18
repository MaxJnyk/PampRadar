import React from 'react';
import { IonList, IonItem, IonLabel, IonBadge, IonSkeletonText } from '@ionic/react';
import { TransactionData } from '../api/tokenDetailApi';
import './TransactionsList.css';

interface TransactionsListProps {
  transactions: TransactionData[];
  isLoading: boolean;
}

/**
 * Компонент списка транзакций токена
 */
export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <IonList className="transactions-list">
        {[...Array(10)].map((_, i) => (
          <IonItem key={i}>
            <IonLabel>
              <IonSkeletonText animated style={{ width: '60%' }} />
              <IonSkeletonText animated style={{ width: '40%' }} />
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-empty">
        <p>Нет транзакций</p>
      </div>
    );
  }

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes}м назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}ч назад`;
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  return (
    <IonList className="transactions-list">
      {transactions.map((tx, index) => (
        <IonItem key={tx.txSignature || index} className="transaction-item">
          <IonLabel>
            <div className="transaction-header">
              <IonBadge color={tx.side === 1 ? 'success' : 'danger'}>
                {tx.side === 1 ? 'BUY' : 'SELL'}
              </IonBadge>
              <span className="transaction-time">{formatTime(tx.txTimestamp)}</span>
            </div>
            <div className="transaction-details">
              <div className="transaction-row">
                <span className="label">Wallet:</span>
                <span className="value">{formatWallet(tx.maker)}</span>
              </div>
              <div className="transaction-row">
                <span className="label">Amount:</span>
                <span className="value">{(tx.tokens / 1000000).toFixed(2)}M tokens</span>
              </div>
              <div className="transaction-row">
                <span className="label">Price:</span>
                <span className="value">${tx.usd.toFixed(2)}</span>
              </div>
              <div className="transaction-row">
                <span className="label">SOL:</span>
                <span className="value">{(tx.lamports / 1e9).toFixed(4)} SOL</span>
              </div>
            </div>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};
