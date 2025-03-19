import React, { useState } from 'react';
import Player from './Player';
import CasinoGame from './CasinoGame';
import SlotMachine from '../SlotMachine/SlotMachine';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

interface GamePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isAvailable: boolean;
}

const GameWorld: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Define positions of casino games in the world
  const gamePositions: GamePosition[] = [
    // Slot Machine (available)
    { id: 'slots', x: 200, y: 200, width: 100, height: 100, name: 'Meme Slot Machine', isAvailable: true },
    // Other games (coming soon)
    { id: 'poker', x: 450, y: 150, width: 100, height: 100, name: 'Crypto Poker', isAvailable: false },
    { id: 'roulette', x: 700, y: 300, width: 100, height: 100, name: 'Blockchain Roulette', isAvailable: false },
    { id: 'blackjack', x: 300, y: 500, width: 100, height: 100, name: 'NFT Blackjack', isAvailable: false },
    { id: 'baccarat', x: 600, y: 550, width: 100, height: 100, name: 'DeFi Baccarat', isAvailable: false },
  ];

  const handleInteraction = (gameId: string) => {
    const game = gamePositions.find(g => g.id === gameId);
    if (game) {
      setActiveGame(gameId);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Background elements - buildings, decorations */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe')] bg-cover bg-center opacity-10" />
      
      {/* Casino floor patterns */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-slot-neon-purple/5 via-slate-900/10 to-slot-neon-green/5" />
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/5" />
          ))}
        </div>
      </div>
      
      {/* Casino games */}
      {gamePositions.map(game => (
        <CasinoGame
          key={game.id}
          id={game.id}
          x={game.x}
          y={game.y}
          width={game.width}
          height={game.height}
          name={game.name}
          isAvailable={game.isAvailable}
        />
      ))}
      
      {/* Player character */}
      <Player onInteract={handleInteraction} gamePositions={gamePositions} />
      
      {/* Dialog for games */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-black/80 backdrop-blur-xl border border-slot-neon-purple rounded-xl p-0 overflow-hidden">
          {activeGame === 'slots' ? (
            <div className="p-4">
              <SlotMachine />
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green mb-4">
                COMING SOON!
              </h2>
              <p className="text-white/80 text-center mb-8">
                {gamePositions.find(g => g.id === activeGame)?.name} is under development.
                Stay tuned for updates!
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink size={18} />
                  <span>Join Our Telegram</span>
                </Button>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Back to Game
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameWorld;
