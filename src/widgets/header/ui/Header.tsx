import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonModal } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { WalletButton } from '../../../features/wallet';
import { CreateTokenModal } from '../../../features/create-token';
import { usePrivyAuth } from '../../../app/provider/PrivyContext';
import './Header.css';

export const Header: React.FC = () => {
  const history = useHistory();
  const { authenticated, login } = usePrivyAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLogoClick = () => {
    history.push('/terminal');
  };

  const handleCreateClick = () => {
    if (!authenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    login();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar className="app-header">
          <div className="header-wrapper">
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
            
            <IonButtons slot="end">
              <IonButton
                onClick={handleCreateClick}
                className="create-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Create</span>
              </IonButton>
              <WalletButton />
            </IonButtons>
          </div>
        </IonToolbar>
      </IonHeader>
    
    <CreateTokenModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    />

    <IonModal isOpen={showLoginPrompt} onDidDismiss={() => setShowLoginPrompt(false)} className="login-prompt-modal">
      <div style={{
        background: '#0A0E1A',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '60px', marginBottom: '24px' }}>🔐</div>
          <h2 style={{ color: '#42BABE', fontSize: '28px', marginBottom: '16px' }}>Login Required</h2>
          <p style={{ color: '#8B92A7', fontSize: '16px', marginBottom: '32px' }}>
            Please login to create tokens on Solana
          </p>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #42BABE 0%, #2DD4BF 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            Login Now
          </button>
          <button
            onClick={() => setShowLoginPrompt(false)}
            style={{
              width: '100%',
              padding: '16px',
              background: '#1E2433',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </IonModal>
  </>
  );
};
