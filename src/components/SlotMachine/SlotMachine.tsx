import React, { useState, useCallback, useRef, useEffect } from 'react';
import SlotReel from './SlotReel';
import BetControls from './BetControls';
import WalletConnect from './WalletConnect';
import InstructionsDialog from './InstructionsDialog';
import { toast } from '../ui/use-toast';
import { getBalance, sendTransaction } from '../../utils/solanaUtils';

const SYMBOLS = ['doge', 'shib', 'pepe', 'moon', 'rocket', 'diamond'];
const TOKENS = ['SOL'];
const HOUSE_WALLET = 'YOUR_HOUSE_WALLET_ADDRESS'; // This should be replaced with the actual house wallet address

const SlotMachine: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelResults, setReelResults] = useState(['doge', 'shib', 'pepe']);
  const [betAmount, setBetAmount] = useState('0.1');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const spinSound = useRef(new Audio('/sounds/spin.mp3'));
  const winSound = useRef(new Audio('/sounds/win.mp3'));
  const loseSound = useRef(new Audio('/sounds/lose.mp3'));

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
        const address = response.publicKey.toString();
        setWalletAddress(address);
        setIsWalletConnected(true);
        const bal = await getBalance(address);
        setBalance(bal);
        toast({
          title: 'Wallet Connected',
          description: `Successfully connected with balance: ${bal.toFixed(4)} SOL`,
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

  const handlePayout = async (amount: number) => {
    try {
      const signature = await sendTransaction(HOUSE_WALLET, walletAddress, amount);
      toast({
        title: 'Payout Successful!',
        description: `You won ${amount} SOL! Transaction: ${signature.slice(0, 8)}...`,
      });
      const newBalance = await getBalance(walletAddress);
      setBalance(newBalance);
    } catch (error) {
      console.error('Payout failed:', error);
      toast({
        title: 'Payout Failed',
        description: 'Unable to process payout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const spinReels = useCallback(async () => {
    if (!isWalletConnected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to play',
        variant: 'destructive',
      });
      return;
    }

    const bet = parseFloat(betAmount);
    if (bet > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough SOL to place this bet',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Send bet amount to house wallet
      await sendTransaction(walletAddress, HOUSE_WALLET, bet);
      
      setIsSpinning(true);
      const newResults = SYMBOLS.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReelResults(newResults);

      spinSound.current.currentTime = 0;
      spinSound.current.play().catch(console.error);

      setTimeout(async () => {
        setIsSpinning(false);
        
        // Check for win conditions
        if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
          const winAmount = bet * 3;
          winSound.current.currentTime = 0;
          winSound.current.play().catch(console.error);
          await handlePayout(winAmount);
        } else {
          loseSound.current.currentTime = 0;
          loseSound.current.play().catch(console.error);
          toast({
            title: 'Better luck next time!',
            description: 'Try again for a chance to win big!',
          });
        }
        
        // Update balance
        const newBalance = await getBalance(walletAddress);
        setBalance(newBalance);
      }, 2500);
    } catch (error) {
      console.error('Error during spin:', error);
      toast({
        title: 'Transaction Failed',
        description: 'Unable to process bet. Please try again.',
        variant: 'destructive',
      });
      setIsSpinning(false);
    }
  }, [betAmount, balance, isWalletConnected, walletAddress]);

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
            <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-6 bg-black rounded-lg border border-gray-700">
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
