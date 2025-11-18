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
      setLoading(false);
    }
  }, [onLoad, setLoading]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return { loadTokens };
};
