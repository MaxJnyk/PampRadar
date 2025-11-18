import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Header } from '../../../widgets/header';
import { CreateTokenForm } from '../../../features/create-token/ui/CreateTokenForm/CreateTokenForm';
import './CreateToken.css';

/**
 * Страница создания токена
 * Следует FSD архитектуре - страница как композиция виджетов и фич
 */
export const CreateToken: React.FC = () => {
  return (
    <IonPage>
      <Header />
      
      <IonContent className="create-token-content">
        <div className="create-token-container">
          <h1 className="page-title">Create a new meme</h1>
          <CreateTokenForm />
        </div>
      </IonContent>
    </IonPage>
  );
};
