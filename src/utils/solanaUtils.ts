
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Devnet connection with commitment level set to 'confirmed'
export const connection = new Connection('https://api.devnet.solana.com', {
  commitment: 'confirmed',
  wsEndpoint: 'wss://api.devnet.solana.com/',
});

// Function to get SOL balance
export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    // Create PublicKey instance and validate it
    const pubKey = new PublicKey(publicKey);
    if (!PublicKey.isOnCurve(pubKey)) {
      throw new Error('Invalid public key');
    }

    // Get balance with explicit commitment
    const balance = await connection.getBalance(pubKey, 'confirmed');
    console.log('Raw balance in lamports:', balance);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log('Converted balance in SOL:', solBalance);
    return solBalance;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
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
        lamports: Math.round(amount * LAMPORTS_PER_SOL),
      })
    );

    if (!window.solana) {
      throw new Error('Phantom wallet not found');
    }

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(fromPubkey);

    // Sign and send the transaction using Phantom wallet
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    
    // Wait for transaction confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }
    
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};
