
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
    <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-slot-reel backdrop-blur-md">
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
