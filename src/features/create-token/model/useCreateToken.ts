import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TokenFormData, TokenCreationResult } from './types';
import { uploadImageToIPFS, uploadMetadataToIPFS } from '../../../shared/lib/ipfs/upload';
import { createSPLToken } from '../../../shared/lib/solana/token';
import { useSolana } from '../../../app/provider/SolanaContext';

/**
 * Хук для создания токена
 * С полной интеграцией Solana через SolanaContext
 */
export const useCreateToken = () => {
  const { walletState, sdk } = useSolana();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Создание токена
   */
  const createToken = useCallback(async (
    formData: TokenFormData
  ): Promise<TokenCreationResult> => {
    setIsCreating(true);
    setError(null);

    try {
      if (!formData.image) {
        throw new Error('Image is required');
      }

      // 1. Загружаем изображение в IPFS
      console.log('Uploading image to IPFS...');
      const imageUrl = await uploadImageToIPFS(formData.image);
      console.log('Image uploaded:', imageUrl);

      // 2. Создаем метаданные
      const metadata = {
        name: formData.name,
        symbol: formData.ticker,
        description: formData.description || '',
        image: imageUrl,
        attributes: [],
        properties: {
          files: [
            {
              uri: imageUrl,
              type: formData.image.type,
            },
          ],
          category: 'image',
        },
        external_url: formData.website || '',
        ...(formData.twitter && { twitter: formData.twitter }),
        ...(formData.telegram && { telegram: formData.telegram }),
        ...(formData.discord && { discord: formData.discord }),
      };

      // 3. Загружаем метаданные в IPFS
      console.log('Uploading metadata to IPFS...');
      const metadataUri = await uploadMetadataToIPFS(metadata);
      console.log('Metadata uploaded:', metadataUri);

      // 4. Проверяем подключение Solana кошелька
      if (!walletState.connected || !walletState.publicKey) {
        throw new Error('Please connect your Solana wallet to create a token');
      }

      // 5. Создаем SPL токен на Solana
      console.log('Creating SPL token on Solana...');
      console.log('Solana wallet address:', walletState.publicKey.toString());
      const publicKey = walletState.publicKey;
      
      // Используем signTransaction из SDK
      const signTransaction = async (tx: Transaction) => {
        return await sdk.wallet.signTransaction(tx);
      };

      const tokenResult = await createSPLToken(
        {
          name: formData.name,
          symbol: formData.ticker,
          decimals: 9,
          supply: 1_000_000_000, // 1 миллиард
          metadataUri,
          payer: publicKey,
        },
        signTransaction,
        sdk.wallet.getConnection()
      );

      console.log('Token created on Solana:', tokenResult);

      return {
        success: true,
        tokenAddress: tokenResult.mintAddress,
        transactionSignature: tokenResult.signature,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create token';
      console.error('Token creation error:', err);
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createToken,
    isCreating,
    error,
  };
};
