import { z } from 'zod';

export const LaunchTokenSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  symbol: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  mint: z.string(),
  creator: z.string(),
  createdAt: z.number().positive(),
  marketCap: z.number().nonnegative(),
  price: z.number().nonnegative(),
  priceChange24h: z.number(),
  volume24h: z.number().nonnegative(),
  liquidity: z.number().nonnegative(),
  holders: z.number().nonnegative().int(),
  transactions24h: z.number().nonnegative().int(),
  isVerified: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  buys: z.number().nonnegative().int().optional(),
  sells: z.number().nonnegative().int().optional(),
  creatorSharePercentage: z.number().min(0).max(1).optional(),
  topHoldersPercentage: z.number().min(0).max(1).optional(),
  isCurrentlyLive: z.boolean().optional(),
  progress: z.number().min(0).max(100).optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().optional(),
});

export const TokenUpdateDataSchema = z.object({
  token: z.string().optional(),
  price: z.number().optional(),
  priceUsd: z.number().optional(),
  volumeSol: z.number().optional(),
  volumeUsd: z.number().optional(),
  marketCapUsd: z.number().optional(),
  txCount: z.number().optional(),
  holders: z.number().optional(),
  buys: z.number().optional(),
  sells: z.number().optional(),
  photo: z.string().optional(),
  progress: z.number().optional(),
  creatorSharePercentage: z.number().optional(),
  topHoldersPercentage: z.number().optional(),
}).passthrough();

export const NewTokenDataSchema = TokenUpdateDataSchema.extend({
  token: z.string(),
  _id: z.string().optional(),
  name: z.string(),
  symbol: z.string(),
  tokenType: z.string().optional(),
  supply: z.number().optional(),
  decimals: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  avatar: z.string().optional(),
  imageUrl: z.string().optional(),
  creator: z.string().optional(),
  _balanceSol: z.number().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().optional(),
  socials: z.object({
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
}).passthrough();

export function validateTokenUpdate(data: unknown) {
  const result = TokenUpdateDataSchema.safeParse(data);
  if (!result.success) {
    return null;
  }
  return result.data;
}

export function validateNewToken(data: unknown) {
  const result = NewTokenDataSchema.safeParse(data);
  if (!result.success) {
    return null;
  }
  return result.data;
}
