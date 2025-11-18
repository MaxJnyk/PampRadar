import React from 'react';
import { IonList, IonItem, IonLabel, IonSkeletonText } from '@ionic/react';
import { HolderData } from '../api/tokenDetailApi';
import './HoldersList.css';

interface HoldersListProps {
  holders: HolderData[];
  isLoading: boolean;
}

/**
 * Компонент списка топ холдеров токена
 */
export const HoldersList: React.FC<HoldersListProps> = ({ holders, isLoading }) => {
  if (isLoading) {
    return (
      <IonList className="holders-list">
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

  if (holders.length === 0) {
    return (
      <div className="holders-empty">
        <p>Нет данных о холдерах</p>
      </div>
    );
  }

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`;
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    return amount.toFixed(0);
  };

  return (
    <IonList className="holders-list">
      {holders.map((holder, index) => (
        <IonItem key={holder._id} className="holder-item">
          <IonLabel>
            <div className="holder-header">
              <span className="holder-rank">#{index + 1}</span>
              <span className="holder-wallet">{formatWallet(holder.wallet)}</span>
            </div>
            <div className="holder-details">
              <div className="holder-row">
                <span className="label">Amount:</span>
                <span className="value">{formatAmount(holder.amount)}</span>
              </div>
              <div className="holder-row">
                <span className="label">Share:</span>
                <span className="value percentage">{(holder.percentage * 100).toFixed(2)}%</span>
              </div>
            </div>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};
