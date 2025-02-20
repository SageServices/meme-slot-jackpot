
import React, { useState, useEffect } from 'react';
import SlotSymbol from './SlotSymbol';

interface SlotReelProps {
  symbols: string[];
  spinning: boolean;
  finalSymbol: string;
  onSpinComplete: () => void;
  delay: number;
}

const SlotReel: React.FC<SlotReelProps> = ({
  symbols,
  spinning,
  finalSymbol,
  onSpinComplete,
  delay,
}) => {
  const [currentSymbol, setCurrentSymbol] = useState(symbols[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (spinning) {
      let spinInterval: NodeJS.Timeout;
      const startSpinning = () => {
        setIsAnimating(true);
        spinInterval = setInterval(() => {
          setCurrentSymbol(symbols[Math.floor(Math.random() * symbols.length)]);
        }, 100);

        setTimeout(() => {
          clearInterval(spinInterval);
          setCurrentSymbol(finalSymbol);
          setIsAnimating(false);
          onSpinComplete();
        }, 2000 + delay);
      };

      setTimeout(startSpinning, delay);

      return () => {
        clearInterval(spinInterval);
      };
    }
  }, [spinning, finalSymbol, delay, onSpinComplete, symbols]);

  return (
    <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800 to-black border border-slot-neon-purple/30 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slot-neon-purple/5 to-transparent pointer-events-none" />
      <div
        className={`transition-transform duration-100 ${
          isAnimating ? 'animate-spin-slot' : ''
        }`}
      >
        <SlotSymbol symbol={currentSymbol} />
      </div>
    </div>
  );
};

export default SlotReel;
