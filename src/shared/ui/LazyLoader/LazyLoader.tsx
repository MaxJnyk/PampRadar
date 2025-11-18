import React, { Suspense } from 'react';
import { IonSpinner } from '@ionic/react';
import './LazyLoader.css';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className="lazy-loader">
      <IonSpinner name="crescent" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};
