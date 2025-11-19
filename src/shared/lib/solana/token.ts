import { 
  Keypair, 
  PublicKey, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  metadataUri: string;
  payer: PublicKey;
}

export interface CreateTokenResult {
  mintAddress: string;
  signature: string;
}

export async function createSPLToken(
  params: CreateTokenParams,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  connection: Connection
): Promise<CreateTokenResult> {
  const { payer, decimals, supply } = params;

  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint,
    payer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const lamports = await connection.getMinimumBalanceForRentExemption(82);
  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint,
      space: 82,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  transaction.add(
    createInitializeMintInstruction(
      mint,
      decimals,
      payer, // mint authority
      payer, // freeze authority
      TOKEN_PROGRAM_ID
    )
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAccount,
      payer,
      mint,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  transaction.add(
    createMintToInstruction(
      mint,
      associatedTokenAccount,
      payer,
      supply * Math.pow(10, decimals),
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  const signedTransaction = await signTransaction(transaction);
  signedTransaction.partialSign(mintKeypair);

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );

  await connection.confirmTransaction(signature, 'confirmed');

  return {
    mintAddress: mint.toBase58(),
    signature,
  };
}
