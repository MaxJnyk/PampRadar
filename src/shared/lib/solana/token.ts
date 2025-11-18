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
  getMint,
} from '@solana/spl-token';

/**
 * Параметры создания токена
 */
export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  metadataUri: string;
  payer: PublicKey;
}

/**
 * Результат создания токена
 */
export interface CreateTokenResult {
  mintAddress: string;
  signature: string;
}

/**
 * Создание SPL токена
 */
export async function createSPLToken(
  params: CreateTokenParams,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  connection: Connection
): Promise<CreateTokenResult> {
  const { payer, decimals, supply } = params;

  // Генерируем новый keypair для mint
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  // Получаем associated token account
  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint,
    payer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Получаем минимальный баланс для rent exemption
  const lamports = await connection.getMinimumBalanceForRentExemption(82);

  // Создаем транзакцию
  const transaction = new Transaction();

  // 1. Создаем mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint,
      space: 82,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  // 2. Инициализируем mint
  transaction.add(
    createInitializeMintInstruction(
      mint,
      decimals,
      payer, // mint authority
      payer, // freeze authority
      TOKEN_PROGRAM_ID
    )
  );

  // 3. Создаем associated token account
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

  // 4. Минтим токены
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

  // Получаем recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  // Сначала подписываем через wallet (payer)
  const signedTransaction = await signTransaction(transaction);
  
  // Потом добавляем подпись mint keypair
  signedTransaction.partialSign(mintKeypair);

  // Отправляем транзакцию
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );

  // Ждем подтверждения
  await connection.confirmTransaction(signature, 'confirmed');

  return {
    mintAddress: mint.toBase58(),
    signature,
  };
}

/**
 * Получение информации о токене
 */
export async function getTokenInfo(mintAddress: string, connection: Connection) {
  try {
    const mint = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mint);
    
    return {
      address: mintAddress,
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
      mintAuthority: mintInfo.mintAuthority?.toBase58(),
      freezeAuthority: mintInfo.freezeAuthority?.toBase58(),
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
}
