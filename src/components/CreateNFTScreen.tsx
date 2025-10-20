import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWalletCTA } from './ConnectWalletCTA';
import { Upload, Sparkles, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { uploadToIPFS, createNFTMetadata } from '../utils/ipfsUpload';
import { toast } from 'sonner';

interface CreateNFTScreenProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export function CreateNFTScreen({ onBack, onNext }: CreateNFTScreenProps) {
  const { isConnected } = useAccount();
  const [artMode, setArtMode] = useState<'upload' | 'ai' | null>(null);
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    collection: '',
    tags: '',
    price: '',
    blockchain: 'Ethereum'
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadToIPFS = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToIPFS(selectedFile);
      setUploadedImage(imageUrl);
      toast.success('Image uploaded to IPFS successfully!');
    } catch (error) {
      console.error('IPFS upload failed:', error);
      toast.error('Failed to upload image to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAI = () => {
    // Simulate AI generation
    setUploadedImage('https://images.unsplash.com/photo-1633151188217-7c4c512f7a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2MDE2Njk0Mnww&ixlib=rb-4.1.0&q=80&w=1080');
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    if (!nftData.name || !nftData.description) {
      toast.error('Please fill in the name and description');
      return;
    }

    try {
      setIsUploading(true);
      const metadataUrl = await createNFTMetadata(
        nftData.name,
        nftData.description,
        uploadedImage,
        attributes.filter(attr => attr.trait_type && attr.value)
      );
      
      onNext({ 
        ...nftData, 
        image: uploadedImage,
        metadataUrl,
        attributes: attributes.filter(attr => attr.trait_type && attr.value)
      });
    } catch (error) {
      console.error('Metadata creation failed:', error);
      toast.error('Failed to create NFT metadata');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl">Create NFT</h1>
        </div>

        {/* Wallet CTA (shown when not connected) */}
        {!isConnected && (
          <div className="mb-6">
            <ConnectWalletCTA
              message="Connect your wallet to mint on-chain. You can still prepare metadata without a wallet."
              onGoToSignIn={onBack}
            />
          </div>
        )}

        {/* Art Upload/Generation */}
        {!artMode && (
          <div className="space-y-4 mb-8">
            <GlassCard 
              className="p-8 cursor-pointer hover:bg-white/10"
              onClick={() => setArtMode('upload')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="mb-1">Upload Existing Art</h3>
                  <p className="text-white/60 text-sm">Upload your own image or artwork</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard 
              className="p-8 cursor-pointer hover:bg-white/10"
              onClick={() => setArtMode('ai')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="mb-1">Generate AI Art</h3>
                  <p className="text-white/60 text-sm">Create unique art with AI</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {artMode === 'upload' && !uploadedImage && (
          <label htmlFor="file-upload" className="block">
            <GlassCard className="p-12 mb-8 text-center cursor-pointer hover:bg-white/10">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="mb-2">Tap to Upload Image</h3>
              <p className="text-white/60 text-sm mb-4">PNG, JPG, GIF up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <div className="inline-block">
                <NeonButton variant="outline">Choose File</NeonButton>
              </div>
            </GlassCard>
          </label>
        )}

        {artMode === 'ai' && !uploadedImage && (
          <GlassCard className="p-6 mb-8">
            <label className="block text-sm text-white/80 mb-2">AI Art Prompt</label>
            <Textarea
              placeholder="Describe your NFT artwork... (e.g., 'futuristic city with neon lights')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 min-h-32 mb-4"
            />
            <NeonButton onClick={handleGenerateAI} className="w-full" disabled={!aiPrompt}>
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Art
              </span>
            </NeonButton>
          </GlassCard>
        )}

        {uploadedImage && (
          <>
            <GlassCard className="mb-8 overflow-hidden">
              <div className="relative h-80">
                <img src={uploadedImage} alt="NFT Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </GlassCard>

            {/* NFT Details Form */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-white/80 mb-2">NFT Name</label>
                <Input
                  placeholder="My Amazing NFT"
                  value={nftData.name}
                  onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Description</label>
                <Textarea
                  placeholder="Describe your NFT..."
                  value={nftData.description}
                  onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Collection</label>
                <Input
                  placeholder="My Collection"
                  value={nftData.collection}
                  onChange={(e) => setNftData({ ...nftData, collection: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Price (ETH)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={nftData.price}
                  onChange={(e) => setNftData({ ...nftData, price: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Blockchain</label>
                <select
                  value={nftData.blockchain}
                  onChange={(e) => setNftData({ ...nftData, blockchain: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Solana">Solana</option>
                </select>
              </div>
            </div>

            {/* IPFS Upload Section */}
            {artMode === 'upload' && selectedFile && (
              <div className="mb-6">
                <NeonButton 
                  onClick={handleUploadToIPFS} 
                  className="w-full mb-4"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading to IPFS...
                    </>
                  ) : (
                    'Upload to IPFS'
                  )}
                </NeonButton>
              </div>
            )}

            {/* Attributes Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm text-white/80">Attributes</label>
                <button
                  onClick={addAttribute}
                  className="text-cyan-400 text-sm hover:text-cyan-300"
                >
                  + Add Attribute
                </button>
              </div>
              
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Trait Type"
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40"
                  />
                  <Input
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <NeonButton 
              onClick={handleNext} 
              className="w-full"
              disabled={!nftData.name || !nftData.price || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Metadata...
                </>
              ) : (
                'Continue to Mint'
              )}
            </NeonButton>
          </>
        )}
      </div>
    </div>
  );
}
