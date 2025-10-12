import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MarketplaceScreenProps {
  onSelectNFT: (nft: any) => void;
  userNFTs: any[];
  likedNFTs: Set<number>;
  onLike: (nftId: number) => void;
}

export function MarketplaceScreen({ onSelectNFT, userNFTs, likedNFTs, onLike }: MarketplaceScreenProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'my-nfts'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const nfts = [
    {
      id: 1,
      title: 'Cosmic Dreams #001',
      creator: 'ArtistX',
      price: '2.5 ETH',
      image: 'https://images.unsplash.com/photo-1654792393225-3e8a53d124d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5mdCUyMGFydHxlbnwxfHx8fDE3NjAyNzgwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 234
    },
    {
      id: 2,
      title: 'Digital Realm #042',
      creator: 'CryptoArt',
      price: '1.8 ETH',
      image: 'https://images.unsplash.com/photo-1622570230304-a37c75da9d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY3J5cHRvJTIwYXJ0fGVufDF8fHx8MTc2MDI3ODAwMXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 189
    },
    {
      id: 3,
      title: 'Neon Futures #123',
      creator: 'FutureWave',
      price: '3.2 ETH',
      image: 'https://images.unsplash.com/photo-1662012061995-0cd4a7ef2d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYwMjMyNDk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 412
    },
    {
      id: 4,
      title: 'Cyber Genesis #007',
      creator: 'PixelMaster',
      price: '4.1 ETH',
      image: 'https://images.unsplash.com/photo-1672581437674-3186b17b405a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAyMDk4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 567
    },
    {
      id: 5,
      title: 'Abstract Void #256',
      creator: 'VoidCreator',
      price: '0.9 ETH',
      image: 'https://images.unsplash.com/photo-1572756317709-fe9c15ced298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBwYXR0ZXJufGVufDF8fHx8MTc2MDI3ODAwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 145
    },
    {
      id: 6,
      title: 'Digital Landscape #089',
      creator: 'LandscapeDAO',
      price: '2.2 ETH',
      image: 'https://images.unsplash.com/photo-1633151188217-7c4c512f7a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2MDE2Njk0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 298
    }
  ];

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
        {displayNFTs.length === 0 ? (
          <GlassCard className="p-12 text-center mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="mb-2">No NFTs found</h3>
            <p className="text-white/60">
              {activeTab === 'my-nfts' 
                ? 'You haven\'t purchased or minted any NFTs yet'
                : 'Try adjusting your search or filters'
              }
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
