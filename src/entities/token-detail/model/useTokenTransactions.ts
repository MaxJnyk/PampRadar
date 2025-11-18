import { useState, useEffect } from 'react';
import { fetchTokenTransactions, TransactionData } from '../api/tokenDetailApi';

interface UseTokenTransactionsReturn {
  transactions: TransactionData[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Хук для загрузки транзакций токена
 */
export const useTokenTransactions = (tokenMint: string): UseTokenTransactionsReturn => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchTokenTransactions(tokenMint);
        
        if (isMounted) {
          setTransactions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load transactions'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, [tokenMint]);

  return { transactions, isLoading, error };
};
