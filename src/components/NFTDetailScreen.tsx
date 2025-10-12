import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, Clock, BarChart3 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface NFTDetailScreenProps {
  nft: any;
  onBack: () => void;
  onBuy: () => void;
  isLiked: boolean;
  onLike: () => void;
}

export function NFTDetailScreen({ nft, onBack, onBuy, isLiked, onLike }: NFTDetailScreenProps) {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerExpiration, setOfferExpiration] = useState('7');

  // Safety check
  if (!nft) {
    return null;
  }

  const ownershipHistory = [
    { owner: 'Creator', price: 'Minted', date: '2 days ago' },
    { owner: '0x742d...a4f3', price: '1.5 ETH', date: '1 day ago' },
    { owner: nft.creator, price: nft.price, date: 'Now' }
  ];

  const handleShare = () => {
    // Show a simple success message - sharing functionality
    toast.success('Share link ready!', {
      description: 'Link: ' + window.location.href
    });
  };

  const handleSubmitOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    toast.success('Offer submitted!', {
      description: `Your offer of ${offerAmount} ETH has been sent to the seller`
    });
    setShowOfferModal(false);
    setOfferAmount('');
  };

  const handleListForSale = () => {
    toast.success('NFT listed for sale!', {
      description: 'Your NFT is now available on the marketplace'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={onLike}
              className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/60'}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Share2 className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* NFT Image with Reflection */}
        <div className="px-6 mb-8">
          <div className="relative">
            <GlassCard className="overflow-hidden" glow>
              <div className="aspect-square relative">
                <ImageWithFallback
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none"></div>
              </div>
            </GlassCard>
            
            {/* Reflection Effect */}
            <div className="absolute -bottom-20 left-0 right-0 h-40 overflow-hidden opacity-20">
              <div className="transform scale-y-[-1] blur-sm">
                <ImageWithFallback
                  src={nft.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]"></div>
            </div>
          </div>
        </div>

        <div className="px-6 mt-24">
          {/* NFT Info */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">{nft.title}</h1>
            <p className="text-white/60">by {nft.creator}</p>
          </div>

          {/* Price & Stats */}
          <GlassCard className="p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-white/40 text-xs mb-1">Current Price</p>
                <p className="text-2xl text-cyan-400">{nft.price}</p>
                <p className="text-white/40 text-xs mt-1">≈ $4,280</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">24h Volume</p>
                <p className="text-lg">125 ETH</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Owners</p>
                <p className="text-lg">1.2K</p>
              </div>
            </div>

            <div className="h-px bg-white/10 my-4"></div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <BarChart3 className="w-4 h-4" />
                <span>+23.4% Floor</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>Ends in 2d 14h</span>
              </div>
            </div>
          </GlassCard>

          {/* Description */}
          <GlassCard className="p-6 mb-6">
            <h3 className="mb-3">Description</h3>
            <p className="text-white/60 leading-relaxed">
              {nft.description || `A unique piece from the ${nft.creator} collection. This NFT represents the intersection of digital art and blockchain technology, capturing the essence of the future.`}
            </p>
          </GlassCard>

          {/* Ownership History */}
          <GlassCard className="p-6 mb-8">
            <h3 className="mb-4">Ownership History</h3>
            <div className="space-y-4">
              {ownershipHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{record.owner}</p>
                    <p className="text-white/40 text-xs">{record.date}</p>
                  </div>
                  <p className="text-cyan-400">{record.price}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <NeonButton onClick={onBuy} className="w-full">
              Buy Now for {nft.price}
            </NeonButton>
            <NeonButton onClick={() => setShowOfferModal(true)} variant="secondary" className="w-full">
              Make an Offer
            </NeonButton>
            <NeonButton onClick={handleListForSale} variant="outline" className="w-full">
              List for Sale
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <GlassCard className="w-full max-w-md p-6">
            <h3 className="text-xl mb-4">Make an Offer</h3>
            <div className="mb-4">
              <label className="block text-sm text-white/80 mb-2">Your Offer (ETH)</label>
              <input
                type="number"
                placeholder="0.00"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-white/80 mb-2">Expiration</label>
              <select 
                value={offerExpiration}
                onChange={(e) => setOfferExpiration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <div className="flex gap-3">
              <NeonButton onClick={() => setShowOfferModal(false)} variant="secondary" className="flex-1">
                Cancel
              </NeonButton>
              <NeonButton onClick={handleSubmitOffer} className="flex-1">
                Submit Offer
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
