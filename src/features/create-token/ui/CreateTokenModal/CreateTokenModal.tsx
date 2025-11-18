import React, { memo } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react';
import { CreateTokenForm } from '../CreateTokenForm/CreateTokenForm';
import './CreateTokenModal.css';

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Модальное окно создания токена
 * Использует Ionic Modal для нативного UX
 */
export const CreateTokenModal: React.FC<CreateTokenModalProps> = memo(({ isOpen, onClose }) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="create-token-modal"
    >
      <IonHeader>
        <IonToolbar className="modal-toolbar">
          <IonTitle>Create a new meme</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="modal-content">
        <div className="modal-container">
          <CreateTokenForm onSuccess={onClose} />
        </div>
      </IonContent>
    </IonModal>
  );
});

CreateTokenModal.displayName = 'CreateTokenModal';
