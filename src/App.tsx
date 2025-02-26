
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React, { useState, useRef } from "react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "@/components/ui/sonner";

interface AppProps {
  rpcUrl: string;
}

const queryClient = new QueryClient();

const App: React.FC<AppProps> = ({ rpcUrl }) => {
  const { publicKey, sendTransaction, connect, disconnect, connecting } =
    useWallet();
  const [betAmount, setBetAmount] = useState<number>(0.1);
  const [result, setResult] = useState<string>("");
  const lastSpinTime = useRef<number>(0);

  // Program ID is public and safe to include in client code
  const PROGRAM_ID = new PublicKey("9298F6CtRHU4HFGcAaiAY3BoiDPw1XXh6yLMHf2AefER");

  // Create a connection with retries and proper error handling
  const connection = new Connection(rpcUrl, {
    commitment: "confirmed",
    wsEndpoint: rpcUrl.replace('https', 'wss'),
    confirmTransactionInitialTimeout: 60000
  });

  const validateBetAmount = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid bet amount");
      return false;
    }
    return true;
  };

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpinTime.current;
    if (timeSinceLastSpin < 2000) { // 2 second cooldown
      toast.error("Please wait before spinning again");
      return false;
    }
    lastSpinTime.current = now;
    return true;
  };

  async function spin(): Promise<void> {
    if (!publicKey) {
      toast.error("Please connect your Phantom wallet first!");
      return;
    }

    if (connecting) {
      setResult("Connecting to wallet...");
      return;
    }

    if (!validateBetAmount(betAmount) || !checkRateLimit()) {
      return;
    }

    console.log("Starting spin with bet amount:", betAmount);
    setResult("Spinning...");
    
    try {
      const lamports = Math.floor(betAmount * 1_000_000_000); // Convert SOL to lamports
      console.log("Bet amount in lamports:", lamports);

      // Create PDA for game state with error handling
      let gameStatePda: PublicKey;
      try {
        [gameStatePda] = await PublicKey.findProgramAddress(
          [Buffer.from("game_state"), publicKey.toBuffer()],
          PROGRAM_ID
        );
      } catch (error) {
        console.error("Error creating PDA:", error);
        toast.error("Failed to initialize game state");
        return;
      }
      console.log("Game state PDA:", gameStatePda.toString());

      const transaction = new Transaction();

      // Create instruction matching Anchor program
      const instruction = {
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: gameStatePda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: Buffer.from([
          57, 12, 108, 106, 109, 99, 56, 182, // "spin" instruction discriminator
          ...new Uint8Array(new BigInt64Array([BigInt(lamports)]).buffer) // bet_amount as u64
        ])
      };

      transaction.add(instruction);
      console.log("Created transaction");
      
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent, signature:", signature);
      
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed");

      // Fetch game state to show result with retry logic
      let accountInfo = null;
      for (let i = 0; i < 3; i++) {
        accountInfo = await connection.getAccountInfo(gameStatePda);
        if (accountInfo) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!accountInfo) {
        throw new Error("Failed to fetch game state");
      }

      const lastSpinResult = accountInfo.data[40] || 0;
      console.log("Last spin result:", lastSpinResult);

      setResult(`Spin result: ${lastSpinResult}. Signature: ${signature}`);
      
      // Calculate winnings based on bet amount and result
      if (lastSpinResult > 7) {
        const winAmount = betAmount * 2; // Double the bet amount for wins
        toast.success(`You won ${winAmount} SOL!`, {
          description: `Transaction: ${signature}`,
        });
      } else {
        toast.error("Better luck next time!", {
          description: `Transaction: ${signature}`,
        });
      }
    } catch (error) {
      console.error("Spin error:", error);
      setResult(`Error: ${error.message}`);
      toast.error("Spin failed!", { description: error.message });
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
                  <div className="text-center p-8">
                    <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green animate-pulse">
                      MEME Slot Machine
                    </h1>
                    <div className="max-w-md mx-auto bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-slot-neon-purple/30 shadow-xl">
                      {!publicKey ? (
                        <button
                          onClick={connect}
                          disabled={connecting}
                          className="bg-gradient-to-r from-slot-neon-purple to-slot-neon-green text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all duration-200 animate-pulse"
                        >
                          {connecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-white/80 break-all">
                            Connected as: {publicKey.toString()}
                          </p>
                          <div className="space-y-2">
                            <label htmlFor="betAmount" className="text-white">
                              Bet Amount (SOL):
                            </label>
                            <input
                              id="betAmount"
                              type="number"
                              value={betAmount}
                              onChange={(e) =>
                                setBetAmount(parseFloat(e.target.value) || 0.1)
                              }
                              min="0.1"
                              max="1"
                              step="0.1"
                              disabled={connecting}
                              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-slot-neon-purple/50 text-white focus:outline-none focus:border-slot-neon-purple focus:ring-1 focus:ring-slot-neon-purple appearance-none"
                            />
                          </div>
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={spin}
                              disabled={connecting || !publicKey}
                              className="bg-gradient-to-r from-slot-neon-purple to-slot-neon-green text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-200"
                            >
                              {connecting ? "Connecting..." : "SPIN! 🎰"}
                            </button>
                            <button
                              onClick={disconnect}
                              className="bg-red-500/80 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-200"
                            >
                              Disconnect
                            </button>
                          </div>
                          {result && (
                            <p className="text-white/80 mt-4 p-4 bg-black/30 rounded-lg">
                              {result}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Index />
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
