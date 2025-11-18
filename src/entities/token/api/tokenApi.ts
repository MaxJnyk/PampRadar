export interface LaunchToken {
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
  // WebSocket live data
  buys?: number;
  sells?: number;
  creatorSharePercentage?: number;
  topHoldersPercentage?: number;
  isCurrentlyLive?: boolean;
  progress?: number;
  // Social links
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface Trade {
  time: number;
  token: string;
  maker: string;
  side: number;
  sol: number;
  tokens: number;
  price: number;
  tx: string;
  block: number;
}

// Use relative path - Netlify will proxy to launch.meme
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Netlify proxy
  : 'https://launch.meme/api';  // Direct for dev
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3NTcxNjY4ODh9.VEvlNmvIFS3ARM5R0jlNN4fwDDRz94WnKv8LDmtipNE';

class LaunchMemeAPIService {
  async getTokens(params?: { limit?: number; offset?: number }): Promise<LaunchToken[]> {
    try {
      const response = await fetch(`${API_BASE}/tokens`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(params || {}),
      });
      if (!response.ok) {
        console.error('❌ API ERROR');
        return this.getMockTokens();
      }
      const data = await response.json();
      const tokensObject = data.tokens || data;
      if (typeof tokensObject === 'object' && !Array.isArray(tokensObject)) {
        // Безопасное преобразование числовых значений
        const safeNumber = (value: any, fallback: number = 0): number => {
          const num = Number(value);
          return isNaN(num) || !isFinite(num) ? fallback : num;
        };

        const tokens = Object.values(tokensObject).map((t: any) => ({
          id: t.token || t._id,
          name: t.name,
          symbol: t.symbol,
          description: t.description || '',
          image: t.photo,
          mint: t.token,
          creator: t.creator,
          createdAt: new Date(t.createdAt).getTime(),
          marketCap: safeNumber(t.marketCapUsd),
          price: safeNumber(t.priceUsd),
          priceChange24h: 0,
          volume24h: safeNumber(t.volumeUsd),
          liquidity: safeNumber(t._balanceSol),
          holders: safeNumber(t.holders),
          transactions24h: safeNumber(t.txCount),
          isVerified: false,
          isTrending: (t.buys || 0) > 100,
          progress: t.progress !== undefined ? safeNumber(t.progress) : undefined,
          buys: safeNumber(t.buys),
          sells: safeNumber(t.sells),
          // Социальные сети
          twitter: t.twitter || t.socials?.twitter,
          telegram: t.telegram || t.socials?.telegram,
          website: t.website || t.socials?.website,
          // Риск-метрики
          creatorSharePercentage: t.creatorSharePercentage !== undefined ? safeNumber(t.creatorSharePercentage) / 100 : undefined,
          topHoldersPercentage: t.topHoldersPercentage !== undefined ? safeNumber(t.topHoldersPercentage) / 100 : undefined,
        }));
        return tokens;
      }
      return this.getMockTokens();
    } catch (error) {
      console.error('💥 ERROR:', error);
      return this.getMockTokens();
    }
  }

  async getTrades(params: { token: string }): Promise<Trade[]> {
    try {
      const response = await fetch(`${API_BASE}/txs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  private getMockTokens(): LaunchToken[] {
    return [
      {
        id: '1',
        name: 'Pepe Coin',
        symbol: 'PEPE',
        description: 'The most memeable memecoin',
        image: 'https://via.placeholder.com/100',
        mint: 'PEPExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        creator: 'Creator1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: Date.now() - 86400000 * 7,
        marketCap: 450000,
        price: 0.000123,
        priceChange24h: 15.6,
        volume24h: 85000,
        liquidity: 2.5,
        holders: 1250,
        transactions24h: 3450,
        isVerified: true,
        isTrending: true,
      },
      {
        id: '2',
        name: 'Doge Killer',
        symbol: 'DOGK',
        description: 'Next generation meme token',
        image: 'https://via.placeholder.com/100',
        mint: 'DOGKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        creator: 'Creator2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: Date.now() - 86400000 * 3,
        marketCap: 320000,
        price: 0.00456,
        priceChange24h: -8.3,
        volume24h: 52000,
        liquidity: 1.8,
        holders: 890,
        transactions24h: 2100,
        isVerified: true,
        isTrending: false,
      },
      {
        id: '3',
        name: 'Moon Rocket',
        symbol: 'MOON',
        description: 'To the moon and beyond',
        image: 'https://via.placeholder.com/100',
        mint: 'MOONxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        creator: 'Creator3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: Date.now() - 86400000,
        marketCap: 180000,
        price: 0.0789,
        priceChange24h: 42.5,
        volume24h: 38000,
        liquidity: 0.95,
        holders: 560,
        transactions24h: 1850,
        isVerified: false,
        isTrending: true,
      },
      {
        id: '4',
        name: 'Shiba 2.0',
        symbol: 'SHIB2',
        description: 'Evolution of SHIB',
        image: 'https://via.placeholder.com/100',
        mint: 'SHIB2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        creator: 'Creator4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: Date.now() - 86400000 * 14,
        marketCap: 670000,
        price: 0.00234,
        priceChange24h: 5.2,
        volume24h: 120000,
        liquidity: 4.2,
        holders: 1890,
        transactions24h: 5600,
        isVerified: true,
        isTrending: false,
      },
      {
        id: '5',
        name: 'Wojak Finance',
        symbol: 'WOJAK',
        description: 'Feel the market',
        image: 'https://via.placeholder.com/100',
        mint: 'WOJAKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        creator: 'Creator5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: Date.now() - 86400000 * 5,
        marketCap: 280000,
        price: 0.00891,
        priceChange24h: -12.4,
        volume24h: 45000,
        liquidity: 1.5,
        holders: 780,
        transactions24h: 1950,
        isVerified: true,
        isTrending: false,
      },
    ];
  }
}

export const launchMemeAPI = new LaunchMemeAPIService();
