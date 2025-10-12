import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { SignInScreen } from './components/SignInScreen';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userName, setUserName] = useState('');
  const [nftData, setNftData] = useState<any>(null);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  
  // App State
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set());
  const [walletBalance, setWalletBalance] = useState(12.5);
  const [contributedProjects, setContributedProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Show bottom nav on main app screens
    const mainScreens: Screen[] = ['home', 'marketplace', 'wallet', 'projects', 'profile'];
    setShowBottomNav(mainScreens.includes(currentScreen));
  }, [currentScreen]);

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

  const handleLogout = () => {
    setUserName('');
    setCurrentScreen('signin');
    toast.success('Logged out successfully');
  };

  const handlePurchaseNFT = (nft: any) => {
    if (walletBalance >= parseFloat(nft.price)) {
      setWalletBalance(prev => prev - parseFloat(nft.price));
      setUserNFTs(prev => [...prev, nft]);
      toast.success(`Successfully purchased ${nft.title}!`, {
        description: `You now own this NFT for ${nft.price}`
      });
      setCurrentScreen('marketplace');
    } else {
      toast.error('Insufficient funds', {
        description: 'Please add more ETH to your wallet'
      });
    }
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
    if (walletBalance >= amount) {
      setWalletBalance(prev => prev - amount);
      setContributedProjects(prev => new Set(prev).add(projectId));
      toast.success('Contribution successful!', {
        description: `You contributed ${amount} ETH to the project`
      });
    } else {
      toast.error('Insufficient funds', {
        description: 'Please add more ETH to your wallet'
      });
    }
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
        return <SignInScreen onSignIn={handleSignIn} />;
      
      case 'home':
        return (
          <HomeScreen 
            userName={userName} 
            onNavigate={handleNavigation}
            walletBalance={walletBalance}
            userNFTCount={userNFTs.length}
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
              walletBalance={walletBalance}
              userNFTCount={userNFTs.length}
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
            balance={walletBalance}
            onSend={(amount) => {
              setWalletBalance(prev => prev - amount);
              toast.success('Transaction sent!', {
                description: `${amount} ETH sent successfully`
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
            nftCount={userNFTs.length}
            totalValue={walletBalance}
          />
        );
      
      default:
        return <HomeScreen userName={userName} onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      {renderScreen()}
      
      {showBottomNav && (
        <BottomNav
          activeScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen as Screen)}
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
