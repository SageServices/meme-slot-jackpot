
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GameWorld from '../components/Metaverse/GameWorld';
import LoadingScreen from '../components/Metaverse/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {isLoading ? (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <div className="relative">
          <GameWorld />
          <div className="fixed bottom-4 right-4 z-10">
            <Link to="/world">
              <Button className="bg-slot-neon-purple hover:bg-slot-neon-purple/90 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20">
                <span className="text-xl">🌐</span>
                <span>Enter 3D World</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
