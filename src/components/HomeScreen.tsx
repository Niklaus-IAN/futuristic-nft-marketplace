import React from 'react';
import { Plus, Palette, Coins, ShoppingBag, Wallet as WalletIcon, ChevronRight, TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Screen = 
  | 'splash'
  | 'onboarding'
  | 'signin'
  | 'home'
  | 'create-nft'
  | 'mint'
  | 'marketplace'
  | 'nft-detail'
  | 'wallet'
  | 'projects'
  | 'profile';

interface HomeScreenProps {
  userName: string;
  onNavigate: (screen: Screen, data?: any) => void;
  userNFTCount: number;
}

export function HomeScreen({ userName, onNavigate, userNFTCount }: HomeScreenProps) {
  const quickActions = [
    { icon: Palette, label: 'Create NFT', color: 'from-cyan-500 to-blue-500', screen: 'create-nft' },
    { icon: Coins, label: 'Mint NFT', color: 'from-purple-500 to-pink-500', screen: 'mint' },
    { icon: ShoppingBag, label: 'Marketplace', color: 'from-magenta-500 to-red-500', screen: 'marketplace' },
    { icon: WalletIcon, label: 'Wallet', color: 'from-green-500 to-teal-500', screen: 'wallet' }
  ];

  const trendingProjects = [
    {
      id: 1,
      title: 'Cosmic Dreams',
      creator: 'ArtistX',
      price: '2.5 ETH',
      image: 'https://images.unsplash.com/photo-1654792393225-3e8a53d124d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5mdCUyMGFydHxlbnwxfHx8fDE3NjAyNzgwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      title: 'Digital Realm',
      creator: 'CryptoArt',
      price: '1.8 ETH',
      image: 'https://images.unsplash.com/photo-1622570230304-a37c75da9d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY3J5cHRvJTIwYXJ0fGVufDF8fHx8MTc2MDI3ODAwMXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: 'Neon Futures',
      creator: 'FutureWave',
      price: '3.2 ETH',
      image: 'https://images.unsplash.com/photo-1662012061995-0cd4a7ef2d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYwMjMyNDk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-white/60 text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
            {userName}
          </h1>
        </div>

        {/* Wallet Balance Card */}
        <GlassCard className="p-6 mb-8 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <p className="text-white/60 text-sm mb-2">Your NFT Collection</p>
            <div className="flex items-end gap-2 mb-4">
              <h2 className="text-4xl">{userNFTCount}</h2>
              <span className="text-xl text-white/60 mb-1">NFTs</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>View in Wallet</span>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg mb-4 text-white/90">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <GlassCard
                  key={action.label}
                  className="p-6 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onNavigate(action.screen as Screen)}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-white/90">{action.label}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Trending Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white/90">Trending Drops</h3>
            <button 
              className="text-cyan-400 text-sm flex items-center gap-1"
              onClick={() => onNavigate('marketplace')}
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {trendingProjects.map((project) => (
              <GlassCard
                key={project.id}
                className="flex-shrink-0 w-64 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onNavigate('nft-detail', project)}
              >
                <div className="relative h-64 rounded-t-3xl overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="mb-1">{project.title}</h4>
                  <p className="text-white/60 text-sm mb-3">by {project.creator}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400">{project.price}</span>
                    <span className="text-white/40 text-xs">Floor Price</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate('create-nft')}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 flex items-center justify-center shadow-[0_0_30px_rgba(138,43,226,0.6)] hover:shadow-[0_0_40px_rgba(138,43,226,0.8)] transition-all z-40"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
