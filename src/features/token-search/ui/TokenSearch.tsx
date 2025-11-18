import React from 'react';
import { IonSearchbar } from '@ionic/react';

interface TokenSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const TokenSearch: React.FC<TokenSearchProps> = ({ value, onChange }) => {
  return (
    <IonSearchbar
      value={value}
      onIonInput={(e) => onChange(e.detail.value || '')}
      placeholder="Search tokens..."
      className="terminal-search"
    />
  );
};
