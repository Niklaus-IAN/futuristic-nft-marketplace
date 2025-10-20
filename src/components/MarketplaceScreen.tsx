import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NFTGallery } from './NFTGallery';
import { useAccount } from 'wagmi';

interface MarketplaceScreenProps {
  onSelectNFT: (nft: any) => void;
  userNFTs: any[];
  likedNFTs: Set<number>;
  onLike: (nftId: number) => void;
}

export function MarketplaceScreen({ onSelectNFT, userNFTs, likedNFTs, onLike }: MarketplaceScreenProps) {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'my-nfts'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  // Real marketplace data will be fetched from blockchain/API
  const nfts: any[] = [];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Clock },
    { id: 'my-nfts', label: 'My NFTs', icon: Sparkles }
  ];

  // Filter NFTs based on search and filters
  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'low') {
      matchesPrice = parseFloat(nft.price) < 2;
    } else if (priceFilter === 'mid') {
      matchesPrice = parseFloat(nft.price) >= 2 && parseFloat(nft.price) < 4;
    } else if (priceFilter === 'high') {
      matchesPrice = parseFloat(nft.price) >= 4;
    }
    
    return matchesSearch && matchesPrice;
  });

  // Show user NFTs or all NFTs based on tab
  const displayNFTs = activeTab === 'my-nfts' ? userNFTs : filteredNFTs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <h1 className="text-3xl mb-6">Marketplace</h1>

        {/* Search Bar */}
        <GlassCard className="p-4 mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search NFTs, collections, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Filter className="w-5 h-5 text-white/60" />
          </button>
        </GlassCard>

        {/* Price Filters */}
        {showFilters && (
          <GlassCard className="p-4 mb-6">
            <h4 className="text-sm text-white/80 mb-3">Price Range</h4>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'low', label: '< 2 ETH' },
                { id: 'mid', label: '2-4 ETH' },
                { id: 'high', label: '> 4 ETH' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPriceFilter(filter.id as any)}
                  className={`
                    px-4 py-2 rounded-xl text-sm transition-all
                    ${priceFilter === filter.id
                      ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20 border-cyan-400/50 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* NFT Grid */}
            {activeTab === 'my-nfts' ? (
              <NFTGallery />
            ) : displayNFTs.length === 0 ? (
              <GlassCard className="p-12 text-center mb-8">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <h3 className="mb-2">
                  {activeTab === 'trending' ? 'Marketplace Coming Soon' : 
                   activeTab === 'new' ? 'New Listings Coming Soon' : 
                   'No NFTs found'}
                </h3>
                <p className="text-white/60">
                  {activeTab === 'trending' || activeTab === 'new' ? 
                   'P2P marketplace features will be available soon' : 
                   'Try adjusting your search or filters'}
                </p>
              </GlassCard>
            ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {displayNFTs.map((nft) => {
              const isLiked = likedNFTs.has(nft.id);
              return (
              <GlassCard
                key={nft.id}
                className="cursor-pointer hover:scale-105 transition-transform overflow-hidden"
              >
                <div className="relative aspect-square" onClick={() => onSelectNFT(nft)}>
                  <ImageWithFallback
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(nft.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className={isLiked ? 'text-red-500' : 'text-white/60'}>
                      {isLiked ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>
              
              <div className="p-4">
                <h4 className="mb-1 truncate">{nft.title}</h4>
                <p className="text-white/60 text-sm mb-3 truncate">by {nft.creator}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Price</p>
                    <p className="text-cyan-400">{nft.price}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 text-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-colors">
                    Buy
                  </button>
                </div>
                </div>
              </GlassCard>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
