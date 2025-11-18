import { useState, useEffect } from 'react';
import { fetchTokenDetail, TokenDetailData, HolderData } from '../api/tokenDetailApi';

interface UseTokenDetailReturn {
  tokenData: TokenDetailData | null;
  holders: HolderData[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Хук для загрузки детальной информации о токене
 */
export const useTokenDetail = (tokenMint: string): UseTokenDetailReturn => {
  const [tokenData, setTokenData] = useState<TokenDetailData | null>(null);
  const [holders, setHolders] = useState<HolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTokenDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchTokenDetail(tokenMint);
        
        if (isMounted) {
          const tokenInfo = response.tokens[tokenMint];
          if (tokenInfo) {
            setTokenData(tokenInfo);
            setHolders(response.holders || []);
          } else {
            throw new Error('Token not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load token'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTokenDetail();

    return () => {
      isMounted = false;
    };
  }, [tokenMint]);

  return { tokenData, holders, isLoading, error };
};
