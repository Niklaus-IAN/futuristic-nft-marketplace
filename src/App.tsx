import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { SignInScreen } from './components/SignInScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { CreateNFTScreen } from './components/CreateNFTScreen';
import { MintConfirmationScreen } from './components/MintConfirmationScreen';
import { MarketplaceScreen } from './components/MarketplaceScreen';
import { NFTDetailScreen } from './components/NFTDetailScreen';
import { WalletScreen } from './components/WalletScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { WagmiProvider, useChainId, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { useOwnedNfts } from './hooks/useOwnedNfts';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const queryClient = new QueryClient();

type Screen = 
  | 'splash'
  | 'onboarding'
  | 'signin'
  | 'signup'
  | 'home'
  | 'create-nft'
  | 'mint'
  | 'marketplace'
  | 'nft-detail'
  | 'wallet'
  | 'projects'
  | 'profile';

// Web3-aware component
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userName, setUserName] = useState('');
  const [nftData, setNftData] = useState<any>(null);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  
  // App State
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set());
  const [contributedProjects, setContributedProjects] = useState<Set<number>>(new Set());
  
  // Web3 hooks
  const chainId = useChainId();
  const isTestnet = chainId === 11155111;
  const { nfts: ownedNfts } = useOwnedNfts();
  const ownedNftCount = ownedNfts.length;
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Show bottom nav on main app screens
    const mainScreens: Screen[] = ['home', 'marketplace', 'wallet', 'projects', 'profile'];
    setShowBottomNav(mainScreens.includes(currentScreen));
  }, [currentScreen]);

  // Persist Firebase auth and show display name
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        setUserName(name);
      }
    });
    return () => unsub();
  }, []);

  const handleNavigation = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      if (screen === 'nft-detail') {
        setSelectedNFT(data);
      } else if (screen === 'mint') {
        setNftData(data);
      }
    }
  };

  const handleSignIn = (name: string) => {
    setUserName(name);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    try {
      const { auth } = await import('./config/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch {}
    try { disconnect(); } catch {}
    setUserName('');
    setCurrentScreen('signin');
    toast.success('Logged out successfully');
  };

  const handlePurchaseNFT = (nft: any) => {
    // P2P marketplace functionality will be implemented later
    toast.info('P2P Marketplace Coming Soon', {
      description: 'Direct NFT trading features will be available soon'
    });
  };

  const handleLikeNFT = (nftId: number) => {
    setLikedNFTs(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(nftId)) {
        newLiked.delete(nftId);
        toast.info('Removed from favorites');
      } else {
        newLiked.add(nftId);
        toast.success('Added to favorites');
      }
      return newLiked;
    });
  };

  const handleContributeToProject = (projectId: number, amount: number) => {
    // Crowdfunding functionality will be implemented later
    toast.info('Crowdfunding Coming Soon', {
      description: 'Project contribution features will be available soon'
    });
  };

  const handleMintNFT = (data: any) => {
    setUserNFTs(prev => [...prev, { ...data, id: Date.now() }]);
    toast.success('NFT minted successfully!', {
      description: 'Your NFT is now on the blockchain'
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('onboarding')} />;
      
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setCurrentScreen('signin')} />;
      
      case 'signin':
        return <SignInScreen onSignIn={handleSignIn} onGoToSignUp={() => setCurrentScreen('signup')} />;
      
      case 'signup':
        return <SignUpScreen onSignedUp={handleSignIn} onGoToSignIn={() => setCurrentScreen('signin')} />;
      
      case 'home':
        return (
          <HomeScreen 
            userName={userName} 
            onNavigate={handleNavigation}
            userNFTCount={ownedNftCount}
          />
        );
      
      case 'create-nft':
        return (
          <CreateNFTScreen
            onBack={() => setCurrentScreen('home')}
            onNext={(data) => handleNavigation('mint', data)}
          />
        );
      
      case 'mint':
        if (!nftData) {
          return (
            <HomeScreen 
              userName={userName} 
              onNavigate={handleNavigation}
              userNFTCount={ownedNftCount}
            />
          );
        }
        return (
          <MintConfirmationScreen
            nftData={nftData}
            onComplete={() => {
              handleMintNFT(nftData);
              setCurrentScreen('marketplace');
            }}
            onViewNFT={() => handleNavigation('nft-detail', nftData)}
          />
        );
      
      case 'marketplace':
        return (
          <MarketplaceScreen
            onSelectNFT={(nft) => handleNavigation('nft-detail', nft)}
            userNFTs={userNFTs}
            likedNFTs={likedNFTs}
            onLike={handleLikeNFT}
          />
        );
      
      case 'nft-detail':
        if (!selectedNFT) {
          return (
            <MarketplaceScreen 
              onSelectNFT={(nft) => handleNavigation('nft-detail', nft)}
              userNFTs={userNFTs}
              likedNFTs={likedNFTs}
              onLike={handleLikeNFT}
            />
          );
        }
        return (
          <NFTDetailScreen
            nft={selectedNFT}
            onBack={() => setCurrentScreen('marketplace')}
            onBuy={() => handlePurchaseNFT(selectedNFT)}
            isLiked={likedNFTs.has(selectedNFT.id)}
            onLike={() => handleLikeNFT(selectedNFT.id)}
          />
        );
      
      case 'wallet':
        return (
          <WalletScreen 
            onSend={(amount) => {
              // Real wallet transactions will be handled by Web3
              toast.info('Wallet Integration Coming Soon', {
                description: 'Direct wallet transactions will be available soon'
              });
            }}
            onReceive={() => {
              toast.info('Receiving address copied to clipboard');
            }}
            onConvert={(fromAmount, fromCurrency, toCurrency) => {
              toast.success('Conversion successful!', {
                description: `Converted ${fromAmount} ${fromCurrency} to ${toCurrency}`
              });
            }}
          />
        );
      
      case 'projects':
        return (
          <ProjectsScreen
            onCreateProject={() => {
              toast.success('Project creation started!', {
                description: 'Fill in the details to launch your project'
              });
            }}
            onContribute={handleContributeToProject}
            contributedProjects={contributedProjects}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen 
            userName={userName} 
            onLogout={handleLogout}
            nftCount={ownedNftCount}
          />
        );
      
      default:
        return <HomeScreen userName={userName} onNavigate={handleNavigation} userNFTCount={ownedNftCount} />;
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      {isTestnet && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 p-3 mb-4 mx-6 rounded-xl">
          <p className="text-sm">⚠️ You're on Sepolia Testnet - This is for testing only</p>
        </div>
      )}
      {renderScreen()}
      
      {showBottomNav && (
        <BottomNav
          activeScreen={currentScreen as any}
          onNavigate={(screen) => setCurrentScreen(screen as any)}
        />
      )}
      
      <Toaster 
        position="top-center"
        richColors
        closeButton
        theme="dark"
      />
    </div>
  );
}

// Main App component with providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}