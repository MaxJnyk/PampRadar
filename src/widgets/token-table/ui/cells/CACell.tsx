import React, { useState } from 'react';
import { LaunchToken } from '../../../../entities/token/api/tokenApi';

interface CACellProps {
  token: LaunchToken;
}

export const CACell: React.FC<CACellProps> = React.memo(({ token }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="data-cell ca-cell">
      <div className="ca-row">
        <div className="cell-primary ca-address" title={token.mint}>
          {token.mint.substring(0, 6)}...{token.mint.substring(token.mint.length - 4)}
        </div>
        <button
          className="copy-button"
          onClick={() => copyToClipboard(token.mint)}
          title="Copy address"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="cell-secondary creator-address" title={token.creator}>
        <span className="by-label">by</span> {token.creator.substring(0, 6)}...{token.creator.substring(token.creator.length - 4)}
      </div>
    </div>
  );
}, (prev, next) => {
  return prev.token.mint === next.token.mint &&
         prev.token.creator === next.token.creator;
});
