
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoaded();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, [onLoaded]);
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-64 sm:w-80 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green mb-4">
          MEME CASINO
        </h1>
        <p className="text-sm sm:text-base text-white/60 mb-8">Loading metaverse environment...</p>
        
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-slot-neon-purple to-slot-neon-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs text-white/40">
          {progress.toFixed(0)}% - Loading assets...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
