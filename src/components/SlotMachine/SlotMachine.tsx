
import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import BetControls from './BetControls';
import WalletConnect from './WalletConnect';
import InstructionsDialog from './InstructionsDialog';
import { useSlotMachine } from '../../hooks/useSlotMachine';
import { getBalance } from '../../utils/solanaUtils';
import { TOKENS } from '../../hooks/useSlotMachine';

const SlotMachine: React.FC = () => {
  const {
    isSpinning,
    reelResults,
    betAmount,
    selectedToken,
    isWalletConnected,
    walletAddress,
    balance,
    setBetAmount,
    setSelectedToken,
    spinReels,
    connectWallet,
    setIsWalletConnected,
    setWalletAddress,
    setBalance,
  } = useSlotMachine();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadPhantom = async () => {
        try {
          if ('solana' in window) {
            const phantom = window.solana;
            if (phantom?.isPhantom) {
              try {
                const response = await phantom.connect({ onlyIfTrusted: true });
                const address = response.publicKey.toString();
                setWalletAddress(address);
                setIsWalletConnected(true);
                const bal = await getBalance(address);
                setBalance(bal);
              } catch (error) {
                console.log("Wallet not connected:", error);
              }
            }
          }
        } catch (error) {
          console.error("Phantom wallet check failed:", error);
        }
      };
      loadPhantom();
    }
  }, [setWalletAddress, setIsWalletConnected, setBalance]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slot-background bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
          <WalletConnect
            onConnect={connectWallet}
            isConnected={isWalletConnected}
            address={walletAddress}
            balance={balance}
          />
        </div>
        
        <div className="flex flex-col items-center gap-4 sm:gap-8 backdrop-blur-xl bg-black/30 p-4 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-slot-neon-purple/20 animate-neon-pulse">
          <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green mb-4 sm:mb-8 animate-neon-pulse text-center">
            Meme Slot Machine
          </h1>
          
          <div className="relative p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl border-t-4 border-slot-neon-purple w-full">
            <GameBoard
              isSpinning={isSpinning}
              reelResults={reelResults}
            />

            <div className="mt-4 sm:mt-8">
              <BetControls
                onSpin={spinReels}
                betAmount={betAmount}
                onBetChange={setBetAmount}
                isSpinning={isSpinning}
                selectedToken={selectedToken}
                onTokenChange={setSelectedToken}
                tokens={TOKENS}
              />
            </div>
          </div>

          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-full animate-bounce shadow-lg">
              🎰 MEGA JACKPOT 🎰
            </div>
          </div>
          
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full w-full max-w-sm">
            <div className="text-center text-sm text-yellow-500 animate-pulse">
              💎 Win up to 1000x your bet! 💎
            </div>
          </div>
        </div>
      </div>
      
      <InstructionsDialog />
    </div>
  );
};

export default SlotMachine;
