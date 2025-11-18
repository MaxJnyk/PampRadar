import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonBadge } from '@ionic/react';
import { LaunchToken } from '../../../../entities/token/api/tokenApi';
import { formatNumber, formatPrice, getProgressColor } from '../../../../shared/lib/formatters';
import { TokenCell } from './TokenCell';
import { CACell } from './CACell';

// Volume Cell
export const VolumeCell: React.FC<{ token: LaunchToken }> = ({ token }) => {
  const buys = token.buys ?? Math.floor((token.transactions24h ?? 0) * 0.6);
  const sells = token.sells ?? ((token.transactions24h ?? 0) - buys);
  
  return (
    <div className="data-cell volume-cell">
      <div className="cell-primary">${formatNumber(token.volume24h)}</div>
      <div className="cell-secondary">
        <span className="buy-count">{buys}</span>
        <span className="count-divider">/</span>
        <span className="sell-count">{sells}</span>
      </div>
    </div>
  );
};

// Market Cap Cell
export const MarketCapCell: React.FC<{ token: LaunchToken }> = ({ token }) => (
  <div className="data-cell mcap-cell">
    <div className="cell-primary">${formatNumber(token.marketCap)}</div>
    <div className="cell-secondary price-value">{formatPrice(token.price)}</div>
  </div>
);

// Progress Cell
export const ProgressCell: React.FC<{ token: LaunchToken }> = ({ token }) => {
  // Используем progress из API, если есть, иначе рассчитываем по marketCap
  const progress = React.useMemo(() => {
    if (token.progress !== undefined && token.progress !== null && token.progress > 0) {
      // Progress приходит уже в процентах (0-100+)
      return token.progress;
    }
    // Fallback: рассчитываем по marketCap (не ограничиваем 100%)
    return (token.marketCap / 85000) * 100;
  }, [token.progress, token.marketCap]);
  
  const progressColor = React.useMemo(() => getProgressColor(progress), [progress]);
  const isGraduated = progress >= 100;
  
  return (
    <div className="data-cell progress-cell">
      <div className="progress-container">
        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${Math.max(0, Math.min(progress, 100))}%`,
              backgroundColor: progressColor,
              transition: 'width 0.5s ease-out, background-color 0.5s ease-out',
            }}
          />
        </div>
        <div className="progress-label">
          {isGraduated ? (
            <IonBadge className="graduated-badge">Graduated</IonBadge>
          ) : (
            <span className="progress-percent">{progress > 0 ? progress.toFixed(1) : '0.0'}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Holders Cell
export const HoldersCell: React.FC<{ token: LaunchToken }> = ({ token }) => {
  const creatorShare = token.creatorSharePercentage ?? 0;
  const topHoldersShare = token.topHoldersPercentage ?? 0;
  
  return (
    <div className="data-cell holders-cell">
      <div className="cell-primary holders-count">{token.holders ?? 0}</div>
      <div className="cell-secondary risk-metrics">
        {creatorShare > 0 && (
          <span className={`risk-badge ${creatorShare > 0.1 ? 'risk-high' : 'risk-low'}`}
                data-tooltip={`Creator holds ${(creatorShare * 100).toFixed(2)}% of supply`}>
            Creator {(creatorShare * 100).toFixed(2)}%
          </span>
        )}
        {topHoldersShare > 0 && (
          <span className={`risk-badge ${topHoldersShare > 0.3 ? 'risk-high' : 'risk-low'}`}
                data-tooltip={`Top 10 holders own ${(topHoldersShare * 100).toFixed(2)}% of supply`}>
            Top10 {(topHoldersShare * 100).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
};

// Trade Cell
export const TradeCell: React.FC<{ token: LaunchToken }> = ({ token }) => {
  const history = useHistory();
  const creatorShare = token.creatorSharePercentage ?? 0;
  const topHoldersShare = token.topHoldersPercentage ?? 0;
  const isHighRisk = creatorShare > 0.1 || topHoldersShare > 0.3;
  
  const handleTradeClick = () => {
    history.push(`/token/${token.mint}`);
  };
  
  return (
    <div className="data-cell trade-cell">
      <IonButton 
        className={`trade-button ${isHighRisk ? 'trade-warning' : ''}`}
        size="small" 
        fill="solid"
        onClick={handleTradeClick}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Trade
      </IonButton>
    </div>
  );
};

export { TokenCell, CACell };
