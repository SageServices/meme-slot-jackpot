
import React, { useState, useCallback, useRef, useEffect } from 'react';
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

  // Pre-load sounds
  const spinSound = useRef(new Audio('/sounds/spin.mp3'));
  const winSound = useRef(new Audio('/sounds/win.mp3'));
  const loseSound = useRef(new Audio('/sounds/lose.mp3'));

  // Check if Phantom is installed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadPhantom = async () => {
        try {
          if ('solana' in window) {
            const phantom = window.solana;
            if (phantom?.isPhantom) {
              // Auto-connect if previously authorized
              try {
                const response = await phantom.connect({ onlyIfTrusted: true });
                setWalletAddress(response.publicKey.toString());
                setIsWalletConnected(true);
              } catch (error) {
                // User hasn't authorized the app yet
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
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.solana !== 'undefined') {
        if (!window.solana.isPhantom) {
          window.open('https://phantom.app/', '_blank');
          toast({
            title: 'Phantom not installed',
            description: 'Please install Phantom wallet from phantom.app',
            variant: 'destructive',
          });
          return;
        }

        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setIsWalletConnected(true);
        toast({
          title: 'Wallet Connected',
          description: 'Successfully connected to Phantom wallet',
        });
      } else {
        window.open('https://phantom.app/', '_blank');
        toast({
          title: 'Phantom not found',
          description: 'Please install Phantom wallet from phantom.app',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to wallet. Please try again.',
        variant: 'destructive',
      });
    }
  }, []);

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
    spinSound.current.currentTime = 0;
    spinSound.current.play().catch(console.error);

    setTimeout(() => {
      setIsSpinning(false);
      // Check for win condition
      if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
        winSound.current.currentTime = 0;
        winSound.current.play().catch(console.error);
        toast({
          title: 'Winner!',
          description: `You won ${Number(betAmount) * 3} ${selectedToken}!`,
          variant: 'default',
        });
      } else {
        loseSound.current.currentTime = 0;
        loseSound.current.play().catch(console.error);
      }
    }, 2500);
  }, [betAmount, isWalletConnected, reelResults, selectedToken]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slot-background bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute top-4 right-4 z-10">
          <WalletConnect
            onConnect={connectWallet}
            isConnected={isWalletConnected}
            address={walletAddress}
          />
        </div>
        
        {/* Main slot machine container with neon effect */}
        <div className="flex flex-col items-center gap-8 backdrop-blur-xl bg-black/30 p-12 rounded-3xl shadow-2xl border border-slot-neon-purple/20 animate-neon-pulse">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green mb-8 animate-neon-pulse">
            Meme Slot Machine
          </h1>
          
          {/* Slot machine frame */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl border-t-4 border-slot-neon-purple">
            {/* Slot display window */}
            <div className="flex gap-4 mb-8 p-6 bg-black rounded-lg border border-gray-700">
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

            {/* Controls section */}
            <div className="mt-8">
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
      </div>
    </div>
  );
};

export default SlotMachine;
