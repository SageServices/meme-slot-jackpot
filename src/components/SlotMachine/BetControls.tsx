
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

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
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="flex gap-2">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => onBetChange(e.target.value)}
          min="0.1"
          step="0.1"
          disabled={isSpinning}
          className="flex-1"
          placeholder="Bet Amount"
        />
        <Select
          value={selectedToken}
          onValueChange={onTokenChange}
          disabled={isSpinning}
        >
          {tokens.map((token) => (
            <Select.Option key={token} value={token}>
              {token}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Button
        onClick={onSpin}
        disabled={isSpinning}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-white font-bold py-3"
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </Button>
    </div>
  );
};

export default BetControls;
