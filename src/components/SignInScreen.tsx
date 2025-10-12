import React, { useState } from 'react';
import { Mail, Chrome, Wallet as WalletIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { Input } from './ui/input';

interface SignInScreenProps {
  onSignIn: (name: string) => void;
}

export function SignInScreen({ onSignIn }: SignInScreenProps) {
  const [email, setEmail] = useState('');

  const handleEmailSignIn = () => {
    if (email) {
      const name = email.split('@')[0];
      onSignIn(name);
    }
  };

  const handleWalletConnect = () => {
    onSignIn('User');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-thin tracking-wider mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 text-transparent bg-clip-text">
            kryptoArt
          </h1>
          <p className="text-white/60 text-sm">Welcome to the future of NFTs</p>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-2xl mb-6 text-center">Sign In</h2>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
            />
          </div>

          <NeonButton 
            onClick={handleEmailSignIn} 
            className="w-full mb-4"
            disabled={!email}
          >
            <span className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Continue with Email
            </span>
          </NeonButton>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <NeonButton variant="secondary" onClick={handleWalletConnect} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <Chrome className="w-5 h-5" />
                Continue with Google
              </span>
            </NeonButton>

            <NeonButton variant="outline" onClick={handleWalletConnect} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <WalletIcon className="w-5 h-5" />
                Connect Wallet
              </span>
            </NeonButton>
          </div>

          {/* Footer Text */}
          <p className="text-center text-white/40 text-xs mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
