import { useEffect, useCallback } from 'react';
import { launchMemeAPI } from '../api/tokenApi';

export const useTokensLoader = (
  onLoad: (tokens: any[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const loadTokens = useCallback(async () => {
    try {
      setLoading(true);
      const data = await launchMemeAPI.getTokens({ limit: 100 });
      onLoad(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load tokens:', error);
      setLoading(false);
    }
  }, [onLoad, setLoading]);

  useEffect(() => {
    // Загружаем токены только один раз при монтировании
    // WebSocket будет обновлять данные в реальном времени
    loadTokens();
  }, [loadTokens]);

  return { loadTokens };
};
