/**
 * Типы для создания токена
 */

export interface TokenFormData {
  // Basic data
  name: string;
  ticker: string;
  description: string;
  image: File | null;
  
  // Social links (optional)
  discord?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  
  // Advanced
  buyAmount?: number;
}

export interface TokenCreationResult {
  success: boolean;
  tokenAddress?: string;
  transactionSignature?: string;
  error?: string;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}
