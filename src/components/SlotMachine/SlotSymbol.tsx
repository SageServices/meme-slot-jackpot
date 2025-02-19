
import React from 'react';
import Image from '../ui/Image';

interface SlotSymbolProps {
  symbol: string;
  isWinning?: boolean;
}

const SlotSymbol: React.FC<SlotSymbolProps> = ({ symbol, isWinning }) => {
  return (
    <div
      className={`w-20 h-20 flex items-center justify-center rounded-lg bg-slot-symbol backdrop-blur-sm transition-all duration-300 ${
        isWinning ? 'animate-slot-win ring-2 ring-yellow-400' : ''
      }`}
    >
      <Image
        src={`/symbols/${symbol}.png`}
        alt={symbol}
        className="w-16 h-16 object-contain"
        width={64}
        height={64}
      />
    </div>
  );
};

export default SlotSymbol;
