import React, { useState } from 'react';
import { Palette, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Palette,
      title: 'Create or Import NFTs Easily',
      description: 'Upload your artwork or generate AI-powered NFTs with just a few taps. Express your creativity in the digital realm.'
    },
    {
      icon: Shield,
      title: 'Connect Wallets Securely',
      description: 'Seamlessly connect with MetaMask, Coinbase Wallet, and more. Your assets are protected with industry-leading security.'
    },
    {
      icon: TrendingUp,
      title: 'Trade, Earn & Contribute',
      description: 'Buy and sell NFTs, support creative projects, and be part of a thriving digital ecosystem.'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-32">
        {/* Icon */}
        <div className="mb-12 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-full blur-xl opacity-50"></div>
            <GlassCard className="relative p-10" glow>
              <Icon className="w-20 h-20 text-cyan-400" strokeWidth={1.5} />
            </GlassCard>
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-md mb-16">
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
            {currentSlideData.title}
          </h2>
          <p className="text-white/60 leading-relaxed">
            {currentSlideData.description}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-gradient-to-r from-cyan-400 to-purple-400'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentSlide < slides.length - 1 && (
            <NeonButton variant="secondary" onClick={onComplete}>
              Skip
            </NeonButton>
          )}
          <NeonButton onClick={handleNext}>
            {currentSlide < slides.length - 1 ? (
              <span className="flex items-center gap-2">
                Next <ChevronRight className="w-5 h-5" />
              </span>
            ) : (
              'Get Started'
            )}
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
