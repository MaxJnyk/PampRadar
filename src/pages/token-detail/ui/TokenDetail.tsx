import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSkeletonText,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { globeOutline, logoTwitter, paperPlaneOutline, arrowBackOutline } from 'ionicons/icons';
import { useTokenDetail, useTokenTransactions } from '../../../entities/token-detail';
import { TransactionsList } from '../../../entities/token-detail/ui/TransactionsList';
import { HoldersList } from '../../../entities/token-detail/ui/HoldersList';
import { PriceChart } from '../../../widgets/price-chart';
import './TokenDetail.css';

/**
 * Страница детального просмотра токена
 */
export const TokenDetail: React.FC = () => {
  const { mint } = useParams<{ mint: string }>();
  const history = useHistory();
  const [selectedSegment, setSelectedSegment] = React.useState<'chart' | 'transactions' | 'holders'>('chart');

  const { tokenData, holders, isLoading: isLoadingToken, error: tokenError } = useTokenDetail(mint);
  const { transactions, isLoading: isLoadingTx } = useTokenTransactions(mint);

  if (tokenError) {
    return (
      <IonPage className="token-detail-page">
        <IonHeader className="token-detail-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.push('/terminal')}>
                <IonIcon icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="token-detail-content">
          <div className="error-message">
            <p>{tokenError.message}</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="token-detail-page">
      <IonHeader className="token-detail-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/terminal')}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <div className="header-title" slot="start" style={{ marginLeft: '16px' }}>
            <div className="logo-section">
              <span className="logo-icon">🕯️</span>
              <span className="logo-text">CANDLES</span>
            </div>
          </div>
          <IonTitle>{isLoadingToken ? 'Loading...' : tokenData?.name || 'Token'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="token-detail-content">
        {/* Token Info Card */}
        <div className="token-info-card">
          <div className="token-header-section">
            {isLoadingToken ? (
              <>
                <IonSkeletonText animated style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                <div className="token-info">
                  <IonSkeletonText animated style={{ width: '200px', height: '28px' }} />
                  <IonSkeletonText animated style={{ width: '100px', height: '18px', marginTop: '8px' }} />
                </div>
              </>
            ) : (
              <>
                <img src={tokenData?.photo} alt={tokenData?.name} className="token-image" />
                <div className="token-info">
                  <h1 className="token-name">{tokenData?.name}</h1>
                  <p className="token-symbol">{tokenData?.symbol}</p>
                  <div className="token-mint">{mint?.slice(0, 8)}...{mint?.slice(-8)}</div>
                </div>
              </>
            )}
          </div>

          {!isLoadingToken && (
            <>
              {/* Stats Grid */}
              <div className="token-stats">
                <div className="stat-item">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">${tokenData?.priceUsd?.toFixed(8) || '0.00'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Market Cap</span>
                  <span className="stat-value">${tokenData?.marketCapUsd?.toLocaleString() || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Volume 24h</span>
                  <span className="stat-value">${tokenData?.volumeUsd?.toLocaleString() || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Holders</span>
                  <span className="stat-value">{tokenData?.holders || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Buys / Sells</span>
                  <span className="stat-value positive">{tokenData?.buys || '0'}</span>
                  <span className="stat-value negative"> / {tokenData?.sells || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Progress</span>
                  <span className="stat-value">{(tokenData?.progress ? tokenData.progress * 100 : 0).toFixed(1)}%</span>
                </div>
              </div>

              {/* Social Links */}
              {(tokenData?.website || tokenData?.x || tokenData?.telegram) && (
                <div className="social-links">
                  {tokenData?.website && (
                    <IonButton className="social-link" onClick={() => window.open(tokenData.website, '_blank')}>
                      <IonIcon slot="start" icon={globeOutline} />
                      Website
                    </IonButton>
                  )}
                  {tokenData?.x && (
                    <IonButton className="social-link" onClick={() => window.open(tokenData.x, '_blank')}>
                      <IonIcon slot="start" icon={logoTwitter} />
                      Twitter
                    </IonButton>
                  )}
                  {tokenData?.telegram && (
                    <IonButton className="social-link" onClick={() => window.open(tokenData.telegram, '_blank')}>
                      <IonIcon slot="start" icon={paperPlaneOutline} />
                      Telegram
                    </IonButton>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Segment Selector */}
        <div className="segment-section">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => setSelectedSegment(e.detail.value as any)}
          >
            <IonSegmentButton value="chart">
              <IonLabel>Chart</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="transactions">
              <IonLabel>Transactions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="holders">
              <IonLabel>Holders</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Content based on selected segment */}
        <div className="content-card">
          {selectedSegment === 'chart' && (
            <div className="chart-container">
              {isLoadingTx ? (
                <div className="loading-container">
                  <IonSpinner className="loading-spinner" />
                  <p>Loading chart data...</p>
                </div>
              ) : transactions.length > 0 ? (
                <PriceChart transactions={transactions} tokenSymbol={tokenData?.symbol} />
              ) : (
                <div className="loading-container">
                  <p>No transaction data available</p>
                </div>
              )}
            </div>
          )}

          {selectedSegment === 'transactions' && (
            <TransactionsList transactions={transactions} isLoading={isLoadingTx} />
          )}

          {selectedSegment === 'holders' && (
            <HoldersList holders={holders} isLoading={isLoadingToken} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
