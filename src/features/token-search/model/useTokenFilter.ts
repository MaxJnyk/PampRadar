import { useMemo } from 'react';
import { LaunchToken } from '../../../entities/token/api/tokenApi';

/**
 * Оптимизированный фильтр токенов с поиском по:
 * - Названию (name)
 * - Символу (symbol)
 * - Описанию (description)
 * - Contract Address (mint)
 */
export const useTokenFilter = (tokens: LaunchToken[], searchText: string) => {
  return useMemo(() => {
    if (!searchText || searchText.trim().length === 0) return tokens;

    const search = searchText.toLowerCase().trim();
    
    return tokens.filter((token) => {
      // Поиск по названию
      if (token.name.toLowerCase().includes(search)) return true;
      
      // Поиск по символу
      if (token.symbol.toLowerCase().includes(search)) return true;
      
      // Поиск по описанию
      if (token.description?.toLowerCase().includes(search)) return true;
      
      // Поиск по contract address (mint)
      if (token.mint.toLowerCase().includes(search)) return true;
      
      return false;
    });
  }, [tokens, searchText]);
};
