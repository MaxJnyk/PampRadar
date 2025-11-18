export interface User {
  wallet: string;
  name?: string;
  avatar?: string;
  createdAt?: number;
  isVerified?: boolean;
}

export interface UserPortfolio {
  wallet: string;
  tokens: PortfolioToken[];
  totalValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioToken {
  token: string;
  symbol: string;
  name: string;
  balance: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}
