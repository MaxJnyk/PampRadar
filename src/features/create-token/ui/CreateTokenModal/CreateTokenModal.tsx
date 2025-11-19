import React, { memo, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react';
import { CreateTokenForm } from '../CreateTokenForm/CreateTokenForm';
import { SuccessModal } from '../SuccessModal/SuccessModal';
import './CreateTokenModal.css';

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTokenModal: React.FC<CreateTokenModalProps> = memo(({ isOpen, onClose }) => {
  const [successData, setSuccessData] = useState<{
    tokenAddress: string;
    transactionSignature: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSuccess = (tokenAddress: string, transactionSignature: string) => {
    onClose();
    setTimeout(() => {
      setSuccessData({ tokenAddress, transactionSignature });
    }, 300);
  };

  const handleCloseSuccess = () => {
    setSuccessData(null);
    onClose();
  };

  return (
    <>
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="create-token-modal"
      backdropDismiss={false}
    >
      <IonHeader>
        <IonToolbar className="modal-toolbar">
          <IonTitle>Create a new meme</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} disabled={isCreating}>
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
          <CreateTokenForm 
            onSuccess={handleSuccess}
            onCreatingChange={setIsCreating}
          />
        </div>
      </IonContent>
    </IonModal>

    <SuccessModal
      isOpen={!!successData}
      onClose={handleCloseSuccess}
      tokenAddress={successData?.tokenAddress || ''}
      transactionSignature={successData?.transactionSignature || ''}
    />
    </>
  );
});

CreateTokenModal.displayName = 'CreateTokenModal';
