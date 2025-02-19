
import React from 'react';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  isConnected: boolean;
  address?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  isConnected,
  address,
}) => {
  return (
    <Button
      onClick={onConnect}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
    >
      <Wallet className="w-4 h-4" />
      {isConnected
        ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
        : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnect;
