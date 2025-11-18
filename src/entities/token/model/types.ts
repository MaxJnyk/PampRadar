export interface Token {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  mint: string;
  creator: string;
  createdAt: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  transactions24h: number;
  isVerified?: boolean;
  isTrending?: boolean;
}

export interface TokenFilters {
  search?: string;
  sortBy?: 'marketCap' | 'volume24h' | 'holders' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  onlyTrending?: boolean;
  onlyVerified?: boolean;
}

/**
 * Данные обновления токена из WebSocket
 */
export interface TokenUpdateData {
  priceUsd?: number;
  volumeUsd?: number;
  marketCapUsd?: number;
  txCount?: number;
  holders?: number;
  buys?: number;
  sells?: number;
  photo?: string;
  progress?: number;
  creatorSharePercentage?: number;
  topHoldersPercentage?: number;
}

/**
 * Данные нового токена из WebSocket
 */
export interface NewTokenData extends TokenUpdateData {
  token: string;
  _id?: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  icon?: string;
  avatar?: string;
  imageUrl?: string;
  creator?: string;
  _balanceSol?: number;
  twitter?: string;
  telegram?: string;
  website?: string;
  socials?: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
}
