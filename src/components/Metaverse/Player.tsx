import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface PlayerProps {
  onInteract: (gameId: string) => void;
  gamePositions: {id: string, x: number, y: number, width: number, height: number}[];
}

const Player: React.FC<PlayerProps> = ({ onInteract, gamePositions }) => {
  const [position, setPosition] = useState({ x: 300, y: 300 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [frame, setFrame] = useState(0);
  const playerSize = 40;
  const speed = 5;
  
  // Track which keys are currently pressed
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.key]: true }));
        setIsMoving(true);
      }

      // Handle interaction with Space or Enter
      if (e.key === ' ' || e.key === 'Enter') {
        checkInteractions();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setKeysPressed(prev => ({ ...prev, [e.key]: false }));
        if (!Object.values(keysPressed).some(v => v)) {
          setIsMoving(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation and movement loop
    const interval = setInterval(() => {
      if (isMoving) {
        setFrame(prev => (prev + 1) % 4);
        
        // Handle movement
        let newX = position.x;
        let newY = position.y;
        let newDirection = direction;

        if (keysPressed['ArrowUp'] || keysPressed['w']) {
          newY -= speed;
          newDirection = 'up';
        }
        if (keysPressed['ArrowDown'] || keysPressed['s']) {
          newY += speed;
          newDirection = 'down';
        }
        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
          newX -= speed;
          newDirection = 'left';
        }
        if (keysPressed['ArrowRight'] || keysPressed['d']) {
          newX += speed;
          newDirection = 'right';
        }

        // Keep player within bounds
        newX = Math.max(playerSize/2, Math.min(newX, window.innerWidth - playerSize/2));
        newY = Math.max(playerSize/2, Math.min(newY, window.innerHeight - playerSize/2));

        setPosition({ x: newX, y: newY });
        setDirection(newDirection);
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [isMoving, position, direction, keysPressed, gamePositions, onInteract]);

  // Check if player is near any interactive elements
  const checkInteractions = () => {
    for (const game of gamePositions) {
      if (
        position.x >= game.x - playerSize && 
        position.x <= game.x + game.width + playerSize &&
        position.y >= game.y - playerSize && 
        position.y <= game.y + game.height + playerSize
      ) {
        onInteract(game.id);
        break;
      }
    }
  };

  // Display movement controls on mobile
  const MobileControls = () => (
    <div className="fixed bottom-4 right-4 grid grid-cols-3 gap-2">
      <div></div>
      <button 
        className="bg-black/30 backdrop-blur-sm p-3 rounded-full"
        onTouchStart={() => {
          setKeysPressed(prev => ({ ...prev, ArrowUp: true }));
          setDirection('up');
          setIsMoving(true);
        }}
        onTouchEnd={() => {
          setKeysPressed(prev => ({ ...prev, ArrowUp: false }));
          setIsMoving(false);
        }}
      >
        <ArrowUp className="text-white" />
      </button>
      <div></div>
      
      <button 
        className="bg-black/30 backdrop-blur-sm p-3 rounded-full"
        onTouchStart={() => {
          setKeysPressed(prev => ({ ...prev, ArrowLeft: true }));
          setDirection('left');
          setIsMoving(true);
        }}
        onTouchEnd={() => {
          setKeysPressed(prev => ({ ...prev, ArrowLeft: false }));
          setIsMoving(false);
        }}
      >
        <ArrowLeft className="text-white" />
      </button>
      
      <button 
        className="bg-black/30 backdrop-blur-sm p-3 rounded-full"
        onTouchStart={() => {
          setKeysPressed(prev => ({ ...prev, ArrowDown: true }));
          setDirection('down');
          setIsMoving(true);
        }}
        onTouchEnd={() => {
          setKeysPressed(prev => ({ ...prev, ArrowDown: false }));
          setIsMoving(false);
        }}
      >
        <ArrowDown className="text-white" />
      </button>
      
      <button 
        className="bg-black/30 backdrop-blur-sm p-3 rounded-full"
        onTouchStart={() => {
          setKeysPressed(prev => ({ ...prev, ArrowRight: true }));
          setDirection('right');
          setIsMoving(true);
        }}
        onTouchEnd={() => {
          setKeysPressed(prev => ({ ...prev, ArrowRight: false }));
          setIsMoving(false);
        }}
      >
        <ArrowRight className="text-white" />
      </button>
    </div>
  );

  // Determine player sprite based on direction and movement
  const getPlayerSprite = () => {
    return `https://res.cloudinary.com/dj5uxv8jy/image/upload/v1621000000/player_${direction}_${isMoving ? frame : 0}.png`;
  };

  return (
    <>
      <div 
        className="absolute z-10 transition-all duration-100"
        style={{
          left: position.x - playerSize/2,
          top: position.y - playerSize/2,
          width: playerSize,
          height: playerSize,
        }}
      >
        <div className="w-full h-full bg-slot-neon-purple rounded-full animate-pulse overflow-hidden flex items-center justify-center">
          {/* Fallback player avatar */}
          <span className="text-white text-xl">
            {direction === 'up' ? '↑' : 
             direction === 'down' ? '↓' : 
             direction === 'left' ? '←' : '→'}
          </span>
        </div>
      </div>
      
      {/* Mobile controls */}
      <div className="md:hidden">
        <MobileControls />
      </div>
      
      {/* Interaction hint */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm md:text-base">
        Use arrow keys or WASD to move. Press Space or Enter to interact.
      </div>
    </>
  );
};

export default Player;
