
import React, { useState, useCallback } from 'react';
import SlotReel from './SlotReel';
import BetControls from './BetControls';
import WalletConnect from './WalletConnect';
import { toast } from '../ui/use-toast';

const SYMBOLS = ['doge', 'shib', 'pepe', 'moon', 'rocket', 'diamond'];
const TOKENS = ['SOL', 'BONK', 'SAMO'];

const SlotMachine: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelResults, setReelResults] = useState(['doge', 'shib', 'pepe']);
  const [betAmount, setBetAmount] = useState('0.1');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const spinReels = useCallback(() => {
    if (!isWalletConnected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to play',
        variant: 'destructive',
      });
      return;
    }

    setIsSpinning(true);
    const newResults = reelResults.map(
      () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    );
    setReelResults(newResults);

    // Play spin sound
    const spinSound = new Audio('/sounds/spin.mp3');
    spinSound.play();

    setTimeout(() => {
      setIsSpinning(false);
      // Check for win condition
      if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
        const winSound = new Audio('/sounds/win.mp3');
        winSound.play();
        toast({
          title: 'Winner!',
          description: `You won ${Number(betAmount) * 3} ${selectedToken}!`,
          variant: 'default',
        });
      } else {
        const loseSound = new Audio('/sounds/lose.mp3');
        loseSound.play();
      }
    }, 2500);
  }, [betAmount, isWalletConnected, reelResults, selectedToken]);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.solana !== 'undefined') {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setIsWalletConnected(true);
        toast({
          title: 'Wallet Connected',
          description: 'Successfully connected to Phantom wallet',
        });
      } else {
        toast({
          title: 'Phantom not found',
          description: 'Please install Phantom wallet',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to wallet',
        variant: 'destructive',
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slot-background p-8">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute top-4 right-4">
          <WalletConnect
            onConnect={connectWallet}
            isConnected={isWalletConnected}
            address={walletAddress}
          />
        </div>
        
        <div className="flex flex-col items-center gap-8 backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-8">Meme Slot Machine</h1>
          
          <div className="flex gap-4 mb-8">
            {[0, 1, 2].map((index) => (
              <SlotReel
                key={index}
                symbols={SYMBOLS}
                spinning={isSpinning}
                finalSymbol={reelResults[index]}
                onSpinComplete={() => {}}
                delay={index * 200}
              />
            ))}
          </div>

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
    </div>
  );
};

export default SlotMachine;
