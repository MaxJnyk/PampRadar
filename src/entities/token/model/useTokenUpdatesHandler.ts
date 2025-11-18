import { useCallback } from 'react';
import { LaunchToken } from '../api/tokenApi';
import { TokenUpdateData, NewTokenData } from './types';
import { safeNumber, fractionToPercent, normalizeImageUrl } from '../../../shared/lib';
import { validateTokenUpdate, validateNewToken } from './schemas';

interface UseTokenUpdatesHandlerProps {
  updateToken: (mint: string, updates: Partial<LaunchToken>) => void;
  addNewToken: (token: LaunchToken) => void;
}

export const useTokenUpdatesHandler = ({
  updateToken,
  addNewToken,
}: UseTokenUpdatesHandlerProps) => {

  const handleLiveUpdate = useCallback(
    (mint: string, data: unknown) => {
      const validatedData = validateTokenUpdate(data);
      if (!validatedData) return;
      
      const updates: Partial<LaunchToken> = {};

      if (validatedData.priceUsd !== undefined) updates.price = safeNumber(validatedData.priceUsd);
      if (validatedData.volumeUsd !== undefined) updates.volume24h = safeNumber(validatedData.volumeUsd);
      if (validatedData.marketCapUsd !== undefined) updates.marketCap = safeNumber(validatedData.marketCapUsd);
      if (validatedData.txCount !== undefined) updates.transactions24h = safeNumber(validatedData.txCount);
      if (validatedData.holders !== undefined) updates.holders = safeNumber(validatedData.holders);
      if (validatedData.buys !== undefined) updates.buys = safeNumber(validatedData.buys);
      if (validatedData.sells !== undefined) updates.sells = safeNumber(validatedData.sells);

      const imageUrl = normalizeImageUrl(validatedData.photo);
      if (imageUrl) {
        updates.image = imageUrl;
      }

      if (validatedData.progress !== undefined) {
        updates.progress = fractionToPercent(validatedData.progress);
      } else if (validatedData.marketCapUsd !== undefined) {
        updates.progress = (safeNumber(validatedData.marketCapUsd) / 85000) * 100;
      }

      if (validatedData.creatorSharePercentage !== undefined) {
        updates.creatorSharePercentage = safeNumber(validatedData.creatorSharePercentage);
      }
      if (validatedData.topHoldersPercentage !== undefined) {
        updates.topHoldersPercentage = safeNumber(validatedData.topHoldersPercentage);
      }

      updateToken(mint, updates);
    },
    [updateToken]
  );

  const handleNewToken = useCallback(
    (data: any) => {
      
      // БЕЗ ВАЛИДАЦИИ - просто берём данные как есть
      const imageUrl = normalizeImageUrl(
        data.photo || data.image || data.icon || data.avatar || data.imageUrl
      );

      const newToken: LaunchToken = {
        id: data.token || data._id || '',
        name: data.name || 'Unknown',
        symbol: data.symbol || '???',
        description: data.description || '',
        image: imageUrl,
        mint: data.token,
        creator: data.creator || '',
        createdAt: Date.now(),
        marketCap: safeNumber(data.marketCapUsd),
        price: safeNumber(data.priceUsd),
        priceChange24h: 0,
        volume24h: safeNumber(data.volumeUsd),
        liquidity: safeNumber(data._balanceSol),
        holders: safeNumber(data.holders),
        transactions24h: safeNumber(data.txCount),
        isVerified: false,
        isTrending: false,
        buys: safeNumber(data.buys),
        sells: safeNumber(data.sells),
        twitter: data.twitter || data.socials?.twitter,
        telegram: data.telegram || data.socials?.telegram,
        website: data.website || data.socials?.website,
      };

      if (data.progress !== undefined) {
        newToken.progress = fractionToPercent(data.progress);
      }

      if (data.creatorSharePercentage !== undefined) {
        newToken.creatorSharePercentage = safeNumber(data.creatorSharePercentage);
      }
      if (data.topHoldersPercentage !== undefined) {
        newToken.topHoldersPercentage = safeNumber(data.topHoldersPercentage);
      }

      addNewToken(newToken);
    },
    [addNewToken]
  );

  return {
    handleLiveUpdate,
    handleNewToken,
  };
};
