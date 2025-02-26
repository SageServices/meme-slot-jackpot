
import { useState, useCallback, useRef } from 'react';
import { getBalance, sendTransaction } from '../utils/solanaUtils';
import { toast } from '../components/ui/use-toast';

export const SYMBOLS = ['doge', 'shib', 'pepe', 'moon', 'rocket', 'diamond'];
export const TOKENS = ['SOL'];
export const HOUSE_WALLET = '4iLbQpA51ZJN5yFf5RoswabcvqWxsninf4GJGGh24o3J';

export const useSlotMachine = () => {
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
  const lastSpinTime = useRef(0);

  const handlePayout = async (amount: number) => {
    try {
      const signature = await sendTransaction(HOUSE_WALLET, walletAddress, amount);
      console.log('Payout transaction signature:', signature);
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

    // Rate limiting
    const now = Date.now();
    if (now - lastSpinTime.current < 3000) {
      toast({
        title: 'Please Wait',
        description: 'Please wait a moment before spinning again',
        variant: 'destructive',
      });
      return;
    }
    lastSpinTime.current = now;

    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Please enter a valid bet amount',
        variant: 'destructive',
      });
      return;
    }

    if (bet > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough SOL to place this bet',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSpinning(true);
      console.log('Sending bet transaction...');
      await sendTransaction(walletAddress, HOUSE_WALLET, bet);
      
      spinSound.current.currentTime = 0;
      await spinSound.current.play().catch(console.error);

      const newResults = SYMBOLS.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReelResults(newResults);
      console.log('New reel results:', newResults);

      // Wait for animation to complete
      setTimeout(async () => {
        setIsSpinning(false);
        
        if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
          const winAmount = bet * 3;
          console.log('Winner! Processing payout of', winAmount, 'SOL');
          winSound.current.currentTime = 0;
          await winSound.current.play().catch(console.error);
          await handlePayout(winAmount);
        } else {
          console.log('No win this time');
          loseSound.current.currentTime = 0;
          await loseSound.current.play().catch(console.error);
          toast({
            title: 'Better luck next time!',
            description: 'Try again for a chance to win big!',
          });
        }
        
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

  return {
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
  };
};
