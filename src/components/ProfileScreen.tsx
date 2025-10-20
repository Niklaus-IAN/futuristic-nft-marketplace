import React from 'react';
import { User, Shield, Bell, Palette, Moon, Info, LogOut, ChevronRight, Edit } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

interface ProfileScreenProps {
  userName: string;
  onLogout: () => void;
  nftCount: number;
}

export function ProfileScreen({ userName, onLogout, nftCount }: ProfileScreenProps) {
  const { isConnected, address } = useAccount();
  
  const userStats = [
    { label: 'NFTs Owned', value: nftCount.toString() },
    { label: 'Created', value: nftCount.toString() },
    { label: 'Wallet Connected', value: isConnected ? 'Yes' : 'No' }
  ];

  const handleMenuClick = (label: string) => {
    toast.info(`${label} - Coming soon!`, {
      description: 'This feature will be available in a future update'
    });
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'My NFTs', badge: nftCount.toString() },
        { icon: Palette, label: 'Created NFTs', badge: nftCount.toString() },
        { icon: Shield, label: 'Transaction History' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Shield, label: 'Security & Privacy' },
        { icon: Bell, label: 'Notifications' },
        { icon: Moon, label: 'App Theme', badge: 'Dark' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Info, label: 'About & Help' },
        { icon: Shield, label: 'Terms of Service' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <h1 className="text-3xl mb-8">Profile</h1>

        {/* Profile Card */}
        <GlassCard className="p-6 mb-8 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-magenta-500 flex items-center justify-center text-3xl">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <button 
                onClick={() => toast.info('Edit profile - Coming soon!')}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl mb-1">{userName}</h2>
              <p className="text-white/60 text-sm mb-2 font-mono">
                {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
              </p>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-400 text-sm">Not Connected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {userStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl mb-1">{stat.value}</p>
                <p className="text-white/60 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm text-white/60 uppercase tracking-wider mb-3 px-2">
              {section.title}
            </h3>
            <GlassCard className="overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <button 
                      onClick={() => handleMenuClick(item.label)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-white/60" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/60">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </div>
                    </button>
                    {index < section.items.length - 1 && (
                      <div className="h-px bg-white/10 mx-6"></div>
                    )}
                  </div>
                );
              })}
            </GlassCard>
          </div>
        ))}

        {/* Logout Button */}
        <GlassCard className="overflow-hidden mb-8">
          <button
            onClick={onLogout}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Logout</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400/60" />
          </button>
        </GlassCard>

        {/* App Version */}
        <p className="text-center text-white/40 text-sm">
          kryptoArt NFT v1.0.0
        </p>
      </div>
    </div>
  );
}
