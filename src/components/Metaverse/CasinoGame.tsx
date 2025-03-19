
import React from 'react';
import { Sparkles, Gamepad } from 'lucide-react';

interface CasinoGameProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isAvailable: boolean;
}

const CasinoGame: React.FC<CasinoGameProps> = ({ id, x, y, width, height, name, isAvailable }) => {
  return (
    <div 
      className={`absolute rounded-xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
        isAvailable 
          ? 'border-slot-neon-green bg-gradient-to-b from-black/60 to-slate-900/60 animate-pulse' 
          : 'border-slot-neon-purple/50 bg-black/30'
      }`}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    >
      {isAvailable ? (
        <Sparkles className="text-slot-neon-green mb-1 h-8 w-8" />
      ) : (
        <Gamepad className="text-slot-neon-purple/70 mb-1 h-8 w-8" />
      )}
      
      <div className={`text-sm font-bold text-center px-2 ${isAvailable ? 'text-white' : 'text-white/60'}`}>
        {name}
      </div>
      
      <div className="absolute -bottom-6 text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
        {isAvailable ? 'Press SPACE to play' : 'Coming Soon'}
      </div>
    </div>
  );
};

export default CasinoGame;
