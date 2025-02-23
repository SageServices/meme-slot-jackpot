
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Devnet connection
export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Function to get SOL balance
export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

// Function to send a transaction
export const sendTransaction = async (
  fromPubkey: string,
  toPubkey: string,
  amount: number
): Promise<string> => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromPubkey),
        toPubkey: new PublicKey(toPubkey),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    if (!window.solana) {
      throw new Error('Phantom wallet not found');
    }

    const { signature } = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

