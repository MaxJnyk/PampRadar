import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { WalletButton } from '../../../features/wallet';
import './Header.css';

/**
 * Глобальный заголовок приложения с названием
 */
export const Header: React.FC = () => {
  const history = useHistory();

  const handleLogoClick = () => {
    history.push('/terminal');
  };

  return (
    <IonHeader>
      <IonToolbar className="app-header">
        <IonTitle>
          <div className="header-content" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <svg className="header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="6" stroke="url(#gradient)" strokeWidth="1.5" fill="none" opacity="0.6"/>
              <circle cx="12" cy="12" r="2" fill="url(#gradient)"/>
              <line x1="12" y1="12" x2="18" y2="8" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <circle cx="18" cy="8" r="2" fill="#42BABE">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#674EEA"/>
                  <stop offset="100%" stopColor="#A38AFB"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="header-title">PumpRadar</span>
          </div>
        </IonTitle>
        
        <IonButtons slot="end">
          <WalletButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
