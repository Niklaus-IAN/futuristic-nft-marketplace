import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-magenta-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-float">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-full blur-2xl opacity-50 animate-glow"></div>
          <div className="relative backdrop-blur-xl bg-white/10 p-12 rounded-full border border-white/20 shadow-2xl">
            <Sparkles className="w-24 h-24 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400" strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-5xl font-thin tracking-wider mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 text-transparent bg-clip-text">
            NEXUS
          </h1>
          <p className="text-white/60 tracking-widest uppercase text-sm">NFT Marketplace</p>
        </div>

        {/* Loading Indicator */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-magenta-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
