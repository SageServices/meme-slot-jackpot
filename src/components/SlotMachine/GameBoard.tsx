
import React from 'react';
import SlotReel from './SlotReel';

interface GameBoardProps {
  isSpinning: boolean;
  reelResults: string[];
}

const GameBoard: React.FC<GameBoardProps> = ({ isSpinning, reelResults }) => {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-6 bg-black rounded-lg border border-gray-700">
      {[0, 1, 2].map((index) => (
        <SlotReel
          key={index}
          symbols={['doge', 'shib', 'pepe', 'moon', 'rocket', 'diamond']}
          spinning={isSpinning}
          finalSymbol={reelResults[index]}
          onSpinComplete={() => {}}
          delay={index * 200}
        />
      ))}
    </div>
  );
};

export default GameBoard;
