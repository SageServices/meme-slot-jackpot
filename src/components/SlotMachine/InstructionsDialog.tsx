
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const InstructionsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 rounded-full w-12 h-12 p-0 bg-slot-neon-purple/20 border-slot-neon-purple hover:bg-slot-neon-purple/30"
        >
          <HelpCircle className="w-6 h-6 text-slot-neon-purple" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-slot-neon-purple">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slot-neon-purple to-slot-neon-green">
            How to Play MEME Slot Machine
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slot-neon-purple">Step 1: Set Up Phantom Wallet</h3>
            <p className="text-gray-300">
              • Install Phantom wallet extension from <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-slot-neon-green hover:underline">phantom.app</a><br />
              • Create a new wallet or import existing one<br />
              • Switch to Solana network in Phantom
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slot-neon-purple">Step 2: Connect Your Wallet</h3>
            <p className="text-gray-300">
              • Click the "Connect Wallet" button in the top-right corner<br />
              • Approve the connection in Phantom popup<br />
              • Your wallet address will appear when connected
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slot-neon-purple">Step 3: Place Your Bet</h3>
            <p className="text-gray-300">
              • Enter your bet amount<br />
              • Select your preferred token (SOL, BONK, or SAMO)<br />
              • Click "SPIN!" to start playing
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slot-neon-purple">Winning</h3>
            <p className="text-gray-300">
              Match three identical symbols to win! Your winnings will be 3x your bet amount.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
