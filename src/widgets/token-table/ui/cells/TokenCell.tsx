import React, { useState, useEffect } from 'react';
import { LaunchToken } from '../../../../entities/token/api/tokenApi';

interface TokenCellProps {
  token: LaunchToken;
}

export const TokenCell: React.FC<TokenCellProps> = ({ token }) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const updateTime = () => {
      const diff = Date.now() - token.createdAt;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) setTimeAgo(`${days}d ago`);
      else if (hours > 0) setTimeAgo(`${hours}h ago`);
      else if (minutes > 0) setTimeAgo(`${minutes}m ago`);
      else if (seconds > 0) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo('Just now');
    };
    
    updateTime();
    // Обновляем каждую секунду для отсчета времени
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [token.createdAt]);

  return (
    <div className="token-info-section" style={{ position: 'relative' }}>
      <div className="token-main">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div className={`token-avatar ${token.isTrending ? 'trending-avatar' : ''}`}>
            {token.image && !imageError ? (
              <img 
                src={token.image} 
                alt={token.symbol} 
                className="token-img"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="token-placeholder">{token.symbol.charAt(0)}</div>
            )}
            {/* Огонек для трендовых токенов */}
            {token.isTrending && (
              <div className="avatar-fire-badge">🔥</div>
            )}
          </div>
          <div className="token-time">{timeAgo}</div>
        </div>
        
        <div className="token-details">
          <div className="token-header">
            <span className="token-name">{token.name}</span>
            <span className="token-divider">/</span>
            <span className="token-symbol">{token.symbol}</span>
          </div>
          
          {token.description && (
            <div className="token-description">{token.description}</div>
          )}
          
          {/* Нижняя линия: соц сети слева, trending badge справа */}
          <div className="token-footer">
            {/* Social Icons - слева */}
            {(token.twitter || token.telegram || token.website) && (
              <div className="social-icons-bottom">
                {token.twitter && (
                  <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {token.telegram && (
                  <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="social-link" title="Telegram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                    </svg>
                  </a>
                )}
                {token.website && (
                  <a href={token.website} target="_blank" rel="noopener noreferrer" className="social-link" title="Website">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
            
            {/* Trending badge - справа (закомментирован, используем огонек на аватарке) */}
            {/* {token.isTrending && (
              <div className="trending-badge-new">
                <span className="fire-icon">🔥</span>
                <span className="trending-text">TRENDING</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
