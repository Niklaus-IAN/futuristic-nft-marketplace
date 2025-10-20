import React from 'react';
import { useAccount } from 'wagmi';
import { GlassCard } from './GlassCard';
import { Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useOwnedNfts } from '../hooks/useOwnedNfts';

export function NFTGallery() {
  const { address, isConnected } = useAccount();
  const { nfts, loading, error, refetch } = useOwnedNfts();

  // Local gateway helper for image fallback
  const getIpfsGateways = (hash: string): string[] => {
    return [
      `https://ipfs.io/ipfs/${hash}`,
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`,
      `https://dweb.link/ipfs/${hash}`,
      `https://ipfs.filebase.io/ipfs/${hash}`,
      `https://nftstorage.link/ipfs/${hash}`,
    ];
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 mb-4">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl mb-2">Connect Your Wallet</h3>
          <p className="text-sm">Connect your wallet to view your NFT collection</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-cyan-400" />
        <p className="text-white/60">Loading your NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl mb-2">Error Loading NFTs</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 mb-4">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl mb-2">No NFTs Found</h3>
          <p className="text-sm">You don't have any NFTs yet. Create your first NFT!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Your NFT Collection</h3>
        <span className="text-sm text-white/60">{nfts.length} NFT{nfts.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft, index) => (
          <GlassCard key={`${nft.contract.address}-${nft.tokenId}`} className="overflow-hidden hover:bg-white/10 transition-all duration-300">
            <div className="relative">
              {/* NFT Image */}
              <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
                {nft.image ? (
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('❌ Image failed to load:', nft.image);
                      const target = e.target as HTMLImageElement;
                      
                      // Try IPFS gateway fallbacks if it's an IPFS URL
                      if (nft.image.includes('ipfs.io/ipfs/')) {
                        const hash = nft.image.split('ipfs.io/ipfs/')[1];
                        const fallbackGateways = getIpfsGateways(hash).slice(1); // Skip first (already tried)
                        
                        if (fallbackGateways.length > 0) {
                        //   console.log('🔄 Trying IPFS fallback:', fallbackGateways[0]);
                          target.src = fallbackGateways[0];
                          return; // Don't hide the image yet
                        }
                      }
                      
                      // Hide image if all fallbacks fail
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                    // onLoad={() => console.log('✅ Image loaded successfully:', nft.image)}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${nft.image ? 'hidden' : ''}`}>
                  <ImageIcon className="w-16 h-16 text-white/40" />
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate mb-1">
                      {nft.name || `Unnamed NFT #${nft.tokenId}`}
                    </h4>
                    <p className="text-sm text-white/60 truncate">
                      {nft.contract.name}
                    </p>
                  </div>
                </div>

                {nft.description && (
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {nft.description}
                  </p>
                )}

                {/* Contract Info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Token #{nft.tokenId}</span>
                  <a
                    href={`https://sepolia.etherscan.io/address/${nft.contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    View Contract
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
