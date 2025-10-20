import React from 'react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { Wallet as WalletIcon } from 'lucide-react';

interface ConnectWalletCTAProps {
  title?: string;
  message?: string;
  onGoToSignIn?: () => void;
}

export function ConnectWalletCTA({
  title = 'Connect Your Wallet',
  message = 'Connect your wallet to access this feature.',
  onGoToSignIn,
}: ConnectWalletCTAProps) {
  return (
    <GlassCard className="p-6 text-center">
      <div className="text-white/60 mb-4">
        <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg mb-2">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
      <NeonButton className="w-full" onClick={onGoToSignIn}>
        Connect Wallet
      </NeonButton>
    </GlassCard>
  );
}


