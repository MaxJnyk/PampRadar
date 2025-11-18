import { useEffect } from 'react';
import { launchMemeWS } from '../../../shared/api/launchMemeWSSimple';

interface LiveUpdateData {
  priceUsd?: number;
  volumeUsd?: number;
  marketCapUsd?: number;
  txCount?: number;
  holders?: number;
  progress?: number;
  creatorSharePercentage?: number;
  topHoldersPercentage?: number;
  buys?: number;
  sells?: number;
}

export const useLiveTokenUpdates = (
  onUpdate: (mint: string, data: LiveUpdateData) => void,
  onNewToken?: (data: any) => void
) => {
  useEffect(() => {
    // Подписка на обновления существующих токенов
    const unsubUpdates = launchMemeWS.subscribeTokenUpdates((mint: string, data: LiveUpdateData) => {
      if (!mint || !data) return;
      onUpdate(mint, data);
    });

    // Подписка на новые токены (если передан коллбэк)
    let unsubNewTokens: (() => void) | undefined;
    if (onNewToken) {
      unsubNewTokens = launchMemeWS.subscribeNewTokens((data: any) => {
        if (!data || !data.token) return;
        onNewToken(data);
      });
    }

    return () => {
      unsubUpdates();
      if (unsubNewTokens) unsubNewTokens();
    };
  }, [onUpdate, onNewToken]);
};
