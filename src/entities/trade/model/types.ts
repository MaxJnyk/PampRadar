export interface Trade {
  time: number;
  token: string;
  maker: string;
  side: number; // 0 = buy, 1 = sell
  sol: number;
  tokens: number;
  price: number;
  tx: string;
  block: number;
}

export type TradeSide = 'buy' | 'sell';
