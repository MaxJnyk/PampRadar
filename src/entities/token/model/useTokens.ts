import { useState, useCallback } from 'react';
import { LaunchToken } from '../api/tokenApi';

export const useTokens = () => {
  const [tokens, setTokens] = useState<LaunchToken[]>([]);
  const [loading, setLoading] = useState(true);

  const updateToken = useCallback((mint: string, updates: Partial<LaunchToken>) => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.mint === mint ? { ...token, ...updates } : token
      )
    );
  }, []);

  const addNewToken = useCallback((newToken: LaunchToken) => {
    setTokens(prevTokens => {
      // Проверяем, не существует ли уже токен
      const exists = prevTokens.some(t => t.mint === newToken.mint);
      if (exists) {
        // Если существует, обновляем его
        return prevTokens.map(t => t.mint === newToken.mint ? newToken : t);
      }
      // Добавляем новый токен в начало списка
      return [newToken, ...prevTokens];
    });
  }, []);

  const setAllTokens = useCallback((newTokens: LaunchToken[]) => {
    setTokens(newTokens);
  }, []);

  return {
    tokens,
    loading,
    setLoading,
    updateToken,
    addNewToken,
    setAllTokens,
  };
};
