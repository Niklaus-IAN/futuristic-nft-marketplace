import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { ConnectWalletCTA } from './ConnectWalletCTA';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { toast } from 'sonner';

interface MintConfirmationScreenProps {
  nftData: any;
  onComplete: () => void;
  onViewNFT: () => void;
}

export function MintConfirmationScreen({ nftData, onComplete, onViewNFT }: MintConfirmationScreenProps) {
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | null>(null);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Realistic gas fee estimation for ERC721 minting
  const estimatedGasFee = 0.0025; // Fallback for display only

  const handleMint = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!nftData.metadataUrl) {
      toast.error('No metadata URL found. Please go back and create your NFT again.');
      return;
    }

    setMinting(true);
    
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintNFT',
        args: [nftData.metadataUrl],
      });
    } catch (err) {
      console.error('Minting failed:', err);
      toast.error('Failed to start minting transaction');
      setMinting(false);
    }
  };

  useEffect(() => {
    if (hash) {
      setTxHash(hash);
      toast.success('Transaction submitted!', {
        description: `Hash: ${hash.slice(0, 10)}...`
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isConfirmed && hash) {
      setMinting(false);
      setMinted(true);
      toast.success('🎉 NFT Minted Successfully!', {
        description: 'Your NFT is now on the blockchain'
      });
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (error) {
      setMinting(false);
      toast.error('Transaction failed', {
        description: error.message
      });
    }
  }, [error]);

  // Safety check
  if (!nftData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {!minting && !minted && (
          <div className="text-center">
            {/* NFT Preview */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-3xl blur-2xl opacity-50 animate-glow"></div>
                <GlassCard className="relative p-8" glow>
                  <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden">
                    {nftData.image && (
                      <img src={nftData.image} alt="NFT Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>

            <h2 className="text-2xl mb-4">Ready to Mint</h2>
            <p className="text-white/60 mb-8">Your NFT is ready to be minted on the blockchain</p>

            {/* NFT Details */}
            <GlassCard className="p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">NFT Name</span>
                <span>{nftData.name}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">Description</span>
                <span className="text-right max-w-48 truncate">{nftData.description}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">Blockchain</span>
                <span>{nftData.blockchain}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">Estimated Gas Fee</span>
                <span className="text-cyan-400">~{estimatedGasFee} ETH</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-center">
                <span>Total Cost</span>
                <span className="text-lg text-cyan-400">~{estimatedGasFee} ETH</span>
              </div>
            </GlassCard>

            {/* Transaction Status */}
            {txHash && (
              <GlassCard className="p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm">Transaction Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Hash:</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            )}

            {isConnected ? (
              <NeonButton 
                onClick={handleMint} 
                className="w-full"
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isPending ? 'Confirm in Wallet...' : 'Confirming...'}
                  </>
                ) : (
                  'Mint NFT'
                )}
              </NeonButton>
            ) : (
              <ConnectWalletCTA
                message="Please connect your wallet to proceed with minting."
              />
            )}
          </div>
        )}

        {minting && (
          <div className="text-center">
            {/* Animated NFT Token */}
            <div className="mb-8 flex justify-center">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-3xl blur-2xl opacity-50 animate-glow"></div>
                <GlassCard className="relative p-12" glow>
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden">
                    {nftData.image && (
                      <img src={nftData.image} alt="NFT" className="w-full h-full object-cover animate-spin-slow" />
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>

            <h2 className="text-2xl mb-4">Minting Your NFT</h2>
            <p className="text-white/60 mb-8">Please wait while we mint your NFT on the blockchain...</p>

            {/* Gas Fee Info */}
            <GlassCard className="p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">NFT Name</span>
                <span>{nftData.name}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">Blockchain</span>
                <span>{nftData.blockchain}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60">Estimated Gas Fee</span>
                <span className="text-cyan-400">~{estimatedGasFee} ETH</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-center">
                <span>Total Cost</span>
                <span className="text-lg text-cyan-400">~{estimatedGasFee} ETH</span>
              </div>
            </GlassCard>

            {/* Loading Indicator */}
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-magenta-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {minted && (
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-50 animate-glow"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#00ffff', '#8a2be2', '#ff00ff'][Math.floor(Math.random() * 3)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            <h2 className="text-3xl mb-4 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
              NFT Successfully Minted!
            </h2>
            <p className="text-white/60 mb-8">
              Your NFT has been minted and is now live on the {nftData.blockchain} blockchain
            </p>
            
            {/* Transaction Details */}
            {txHash && (
              <GlassCard className="p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Transaction Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Hash:</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            )}

            <GlassCard className="p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  {nftData.image && (
                    <img src={nftData.image} alt="NFT" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h4 className="mb-1">{nftData.name}</h4>
                  <p className="text-white/60 text-sm mb-2">{nftData.collection}</p>
                  <p className="text-cyan-400">{nftData.price} ETH</p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <NeonButton onClick={onViewNFT} className="w-full">
                View NFT
              </NeonButton>
              <NeonButton onClick={onComplete} variant="secondary" className="w-full">
                Share on Marketplace
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
