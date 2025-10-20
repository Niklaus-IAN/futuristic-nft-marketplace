import React from 'react';
import { Home, ShoppingBag, Wallet, Globe, User } from 'lucide-react';
import { useAccount } from 'wagmi';

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

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const { isConnected, address } = useAccount();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Market' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'projects', icon: Globe, label: 'Projects' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-4 mb-4 backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20' : ''}
                  `}
                >
                  <Icon 
                    className={`
                      w-6 h-6 transition-all duration-300
                      ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-white/60'}
                    `}
                  />
                  <span className={`text-xs transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                </button>
                
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
