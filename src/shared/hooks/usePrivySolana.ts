import { useEffect } from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { usePrivyAuth } from '../../app/provider/PrivyContext';
import { useSolana } from '../../app/provider/SolanaContext';

export const usePrivySolana = () => {
  const { authenticated, user } = usePrivyAuth();
  const { sdk } = useSolana();

  useEffect(() => {
    const handlePrivyAuth = async () => {
      if (authenticated && user?.email?.address) {
        try {
          const seed = new TextEncoder().encode(user.email.address);
          const seedArray = new Uint8Array(32);
          for (let i = 0; i < seed.length && i < 32; i++) {
            seedArray[i] = seed[i];
          }
          
          const keypair = Keypair.fromSeed(seedArray);
          
          await sdk.wallet.connectCustomWallet('Privy Email Wallet', {
            publicKey: keypair.publicKey,
            signTransaction: async (tx: Transaction) => {
              tx.sign(keypair);
              return tx;
            },
            signAllTransactions: async (txs: Transaction[]) => {
              txs.forEach((tx: Transaction) => tx.sign(keypair));
              return txs;
            }
          });
        } catch (error) {
        }
      } else if (!authenticated) {
        try {
          await sdk.wallet.disconnectWallet();
        } catch (error) {
        }
      }
    };

    handlePrivyAuth();
  }, [authenticated, user, sdk]);

  return { authenticated, user };
}; 