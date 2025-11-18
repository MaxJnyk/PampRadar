import { HttpClient } from '../../../shared/api/base/httpClient';

const API_BASE = '/api';

const httpClient = new HttpClient(API_BASE);

export interface TokenDetailData {
  version: number;
  token: string;
  tokenType: string;
  supply: number;
  decimals: number;
  mint_time: number;
  name: string;
  symbol: string;
  metadataUri: string;
  photo: string;
  description: string;
  website?: string;
  x?: string;
  telegram?: string;
  creator: string;
  pool: string;
  hardcap: number;
  list_time: number;
  isMigrated: boolean;
  migrationPool?: string;
  lastTradeId: string;
  priceSol: number;
  priceUsd: number;
  marketCapUsd: number;
  progress: number;
  progressSol: number;
  _balanceSol: number;
  _balanceTokens: number;
  last_tx_time: number;
  buys: number;
  sells: number;
  txCount: number;
  holders: number;
  volumeSol: number;
  volumeUsd: number;
  isDraft: boolean;
  isCurrentlyLive: boolean;
  createdAt: string;
  updatedAt: string;
  topHoldersPercentage: number;
}

export interface HolderData {
  wallet: string;
  amount: number;
  percentage: number;
  _id: string;
}

export interface TokenDetailResponse {
  tokens: {
    [key: string]: TokenDetailData;
  };
  holders: HolderData[];
}

export interface TransactionData {
  txSignature: string;
  maker: string;
  side: number; // 1 = buy, -1 = sell
  lamports: number;
  tokens: number;
  priceUsd: number;
  priceSol: number;
  txTimestamp: number;
  usd: number;
  sol: number;
}

/**
 * Получить детальную информацию о токене
 */
export const fetchTokenDetail = async (tokenMint: string): Promise<TokenDetailResponse> => {
  return httpClient.post<TokenDetailResponse>('/tokens', {
    id: tokenMint,
  });
};

/**
 * Получить список транзакций токена
 */
export const fetchTokenTransactions = async (tokenMint: string): Promise<TransactionData[]> => {
  try {
    const response = await httpClient.post<any[]>('/txs', {
      token: tokenMint,
    });
    
    // Преобразуем Mongoose документы в чистые объекты
    return response.map((tx: any) => {
      const doc = tx._doc || tx;
      return {
        txSignature: doc.txSignature,
        maker: doc.maker,
        side: doc.side, // 1 = buy, -1 = sell
        lamports: doc.lamports,
        tokens: doc.tokens,
        priceUsd: doc.priceUsd,
        priceSol: doc.priceSol,
        txTimestamp: doc.txTimestamp,
        usd: doc.usd,
        sol: tx.sol || (doc.lamports / 1e9),
      };
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};
