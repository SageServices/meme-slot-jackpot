// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React, { useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface AppProps {
    rpcUrl: string;
}

const queryClient = new QueryClient();

const App: React.FC<AppProps> = ({ rpcUrl }) => {
    const { publicKey, sendTransaction, connect, disconnect, connecting } = useWallet();
    const [betAmount, setBetAmount] = useState<number>(0.1); // In SOL
    const [result, setResult] = useState<string>('');

    // Use environment variables for sensitive data
    const PROGRAM_ID = new PublicKey(import.meta.env.VITE_PROGRAM_ID);

    const connection = new Connection(rpcUrl, 'confirmed');

    async function spin(): Promise<void> {
        if (!publicKey) {
            alert('Please connect your Phantom wallet first!');
            return;
        }

        if (connecting) {
            setResult('Connecting to wallet...');
            return;
        }

        setResult('Spinning...');
        try {
            const lamports = Math.floor(betAmount * 1_000_000_000);
            const transaction = new Transaction();

            // Build a simple instruction (match your smart contract’s spin function)
            const instruction = {
                keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
                programId: PROGRAM_ID,
                data: Buffer.from([0, ...lamports.toString().padStart(8, '0')]), // Simplified data
            };

            transaction.add({ ...instruction });
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            setResult(`Spin successful! Signature: ${signature}`);
            // Optionally, show a toast for success
            Sonner.success('Spin completed successfully!', { description: `Transaction: ${signature}` });
        } catch (error) {
            setResult(`Error: ${error.message}`);
            Sonner.error('Spin failed!', { description: error.message });
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div>
                                    <div style={{ textAlign: 'center', margin: '20px', color: '#fff', backgroundColor: '#1a1a1a' }}>
                                        <h1 style={{ color: '#00ff00' }}>MEME Slot Machine</h1>
                                        {!publicKey ? (
                                            <button onClick={connect} disabled={connecting}>
                                                {connecting ? 'Connecting...' : 'Connect Wallet'}
                                            </button>
                                        ) : (
                                            <>
                                                <p>Connected as: {publicKey.toString()}</p>
                                                <label htmlFor="betAmount">Bet Amount (SOL):</label>
                                                <input
                                                    id="betAmount"
                                                    type="number"
                                                    value={betAmount}
                                                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0.1)}
                                                    min="0.1"
                                                    max="1"
                                                    step="0.1"
                                                    disabled={connecting}
                                                    style={{ padding: '5px', margin: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                />
                                                <button onClick={spin} disabled={connecting || !publicKey}>
                                                    {connecting ? 'Connecting...' : 'Spin!'}
                                                </button>
                                                <button onClick={disconnect}>Disconnect</button>
                                                <p>{result}</p>
                                            </>
                                        )}
                                    </div>
                                    <Index /> {/* Preserve your existing Index page */}
                                </div>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;