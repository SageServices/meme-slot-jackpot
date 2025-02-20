
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface BetControlsProps {
  onSpin: () => void;
  betAmount: string;
  onBetChange: (value: string) => void;
  isSpinning: boolean;
  selectedToken: string;
  onTokenChange: (value: string) => void;
  tokens: string[];
}

const BetControls: React.FC<BetControlsProps> = ({
  onSpin,
  betAmount,
  onBetChange,
  isSpinning,
  selectedToken,
  onTokenChange,
  tokens,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-xs mx-auto">
      <div className="flex gap-2">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => onBetChange(e.target.value)}
          min="0.1"
          step="0.1"
          disabled={isSpinning}
          className="flex-1 bg-gray-900 border-slot-neon-purple text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
          placeholder="Bet Amount"
        />
        <Select value={selectedToken} onValueChange={onTokenChange} disabled={isSpinning}>
          <SelectTrigger className="w-[80px] sm:w-[100px] bg-gray-900 border-slot-neon-purple text-white text-sm sm:text-base h-9 sm:h-10">
            <SelectValue placeholder="Token" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-slot-neon-purple">
            {tokens.map((token) => (
              <SelectItem key={token} value={token} className="text-white hover:bg-slot-neon-purple/20">
                {token}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onSpin}
        disabled={isSpinning}
        className={`w-full py-4 sm:py-6 text-base sm:text-lg font-bold transition-all duration-300 ${
          isSpinning
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-slot-neon-purple to-slot-neon-green hover:from-slot-neon-purple/80 hover:to-slot-neon-green/80 animate-neon-pulse'
        }`}
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </Button>
    </div>
  );
};

export default BetControls;
