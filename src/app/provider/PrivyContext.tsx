import React, { createContext, useContext, ReactNode } from 'react';
import { PrivyProvider as PrivyProviderBase, usePrivy } from '@privy-io/react-auth';
import logo from '../../shared/assets/logo.png';

interface PrivyContextType {
  login: () => void;
  logout: () => void;
  authenticated: boolean;
  user: any;
  ready: boolean;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

interface PrivyProviderProps {
  children: ReactNode;
}

const PrivyAuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { login, logout, authenticated, user, ready } = usePrivy();

  const value: PrivyContextType = {
    login: () => login({ loginMethods: ['email'] }),
    logout,
    authenticated,
    user,
    ready
  };

  return (
    <PrivyContext.Provider value={value}>
      {children}
    </PrivyContext.Provider>
  );
};

export const PrivyProvider: React.FC<PrivyProviderProps> = ({ children }) => {
  return (
    <PrivyProviderBase
      appId="cmbf1wlvo00d7jm0no9hnu50a"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#42BABE',
          logo,
        },
        loginMethods: ['email'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <PrivyAuthWrapper>{children}</PrivyAuthWrapper>
    </PrivyProviderBase>
  );
};

export const usePrivyAuth = (): PrivyContextType => {
  const context = useContext(PrivyContext);
  if (context === undefined) {
    throw new Error('usePrivyAuth must be used within a PrivyProvider');
  }
  return context;
}; 