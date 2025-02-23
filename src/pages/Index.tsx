
import SlotMachine from '../components/SlotMachine/SlotMachine';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f')] opacity-10 bg-cover bg-center mix-blend-overlay" />
      <div className="absolute top-0 left-0 right-0 py-4 bg-gradient-to-r from-slot-neon-purple via-slot-neon-green to-slot-neon-purple animate-pulse">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center animate-bounce">
          🚀 WIN THE MEGA JACKPOT 💎
        </h1>
      </div>
      <div className="relative pt-20">
        <SlotMachine />
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-2 bg-black/50 backdrop-blur-sm">
        <p className="text-center text-xs md:text-sm text-white animate-pulse">
          🎰 SPIN TO WIN BIG! 💰 MEGA PRIZES AWAIT! 🎯
        </p>
      </div>
    </div>
  );
};

export default Index;

