
import { useState } from 'react';
import GameWorld from '../components/Metaverse/GameWorld';
import LoadingScreen from '../components/Metaverse/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {isLoading ? (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <GameWorld />
      )}
    </div>
  );
};

export default Index;
