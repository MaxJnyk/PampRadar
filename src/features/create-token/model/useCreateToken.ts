import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TokenFormData, TokenCreationResult } from './types';
import { uploadImageToIPFS, uploadMetadataToIPFS } from '../../../shared/lib/ipfs/upload';
import { createSPLToken } from '../../../shared/lib/solana/token';
import { useSolana } from '../../../app/provider/SolanaContext';

export const useCreateToken = () => {
  const { walletState, sdk } = useSolana();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createToken = useCallback(async (
    formData: TokenFormData
  ): Promise<TokenCreationResult> => {
    setIsCreating(true);
    setError(null);

    try {
      if (!formData.image) {
        throw new Error('Image is required');
      }

      const imageUrl = await uploadImageToIPFS(formData.image);

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

      const metadataUri = await uploadMetadataToIPFS(metadata);

      if (!walletState.connected || !walletState.publicKey) {
        throw new Error('Please connect your Solana wallet to create a token');
      }

      const publicKey = walletState.publicKey;
      
      const signTransaction = async (tx: Transaction) => {
        return await sdk.wallet.signTransaction(tx);
      };

      const tokenResult = await createSPLToken(
        {
          name: formData.name,
          symbol: formData.ticker,
          decimals: 9,
          supply: 1_000_000_000,
          metadataUri,
          payer: publicKey,
        },
        signTransaction,
        sdk.wallet.getConnection()
      );

      return {
        success: true,
        tokenAddress: tokenResult.mintAddress,
        transactionSignature: tokenResult.signature,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create token';
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
