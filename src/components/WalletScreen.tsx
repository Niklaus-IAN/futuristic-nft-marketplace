import React, { useEffect, useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet as WalletIcon, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { NFTGallery } from './NFTGallery';
import { toast } from 'sonner';
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import { Alchemy, Network } from 'alchemy-sdk'

interface WalletScreenProps {
  onSend: (amount: number) => void;
  onReceive: () => void;
  onConvert: (fromAmount: number, fromCurrency: string, toCurrency: string) => void;
}

export function WalletScreen({ onSend, onReceive, onConvert }: WalletScreenProps) {
const { address, isConnected } = useAccount()
const { data: balanceData } = useBalance({ address })
const { disconnect } = useDisconnect()
const chainId = useChainId()
const { switchChain } = useSwitchChain()

// Use real balance from blockchain
const realBalance = balanceData ? parseFloat(formatEther(balanceData.value)) : 0
  const [activeTab, setActiveTab] = useState<'assets' | 'transactions' | 'convert'>('assets');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [convertFromAmount, setConvertFromAmount] = useState('');
  const [convertFromCurrency, setConvertFromCurrency] = useState('ETH');
  const [convertToCurrency, setConvertToCurrency] = useState('USDC');
  const [pricesUsd, setPricesUsd] = useState<{ ETH: number; USDC: number; MATIC: number }>({ ETH: 0, USDC: 1, MATIC: 0 });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [topCoins, setTopCoins] = useState<any[]>([]);
  const [tokenBalances, setTokenBalances] = useState<Array<{ symbol: string; name: string; balance: string; usd?: number }>>([]);
  const [txs, setTxs] = useState<any[]>([]);

  // Fetch live USD prices using CoinGecko (no API key needed)
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoadingRates(true);
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,polygon-pos&vs_currencies=usd',
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPricesUsd({
          ETH: data?.ethereum?.usd ?? 0,
          USDC: data?.['usd-coin']?.usd ?? 1,
          MATIC: data?.['polygon-pos']?.usd ?? 0,
        });
      } catch (e) {
        toast.error('Failed to load live prices');
      } finally {
        setIsLoadingRates(false);
      }
    };
    fetchPrices();
    const id = setInterval(fetchPrices, 60_000); // refresh every 60s
    return () => clearInterval(id);
  }, []);

  const getRate = (from: string, to: string): number => {
    const fromUsd = pricesUsd[from as keyof typeof pricesUsd] || 0;
    const toUsd = pricesUsd[to as keyof typeof pricesUsd] || 0;
    if (!fromUsd || !toUsd) return 0;
    // amount_in_to = amount_in_from * (fromUsd / toUsd)
    return fromUsd / toUsd;
  };

  // Top 5 market coins (CoinGecko)
  useEffect(() => {
    const loadTopCoins = async () => {
      try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets'
          + '?vs_currency=usd&ids=bitcoin,ethereum,solana,usd-coin,binancecoin'
          + '&price_change_percentage=1h,24h,7d';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTopCoins(Array.isArray(data) ? data : []);
      } catch (e) {
        // silent fail; widget degrades gracefully
      }
    };
    loadTopCoins();
    const id = setInterval(loadTopCoins, 60_000);
    return () => clearInterval(id);
  }, []);

  // Real user assets (ETH + ERC-20) and recent transfers (Alchemy)
  useEffect(() => {
    const fetchOnChainData = async () => {
      if (!address) return;

      const settings = {
        apiKey: (import.meta as any).env.VITE_ALCHEMY_API_KEY?.replace('https://eth-sepolia.g.alchemy.com/v2/', ''),
        network: Network.ETH_SEPOLIA,
      };
      const alchemy = new Alchemy(settings);

      // ERC-20 balances
      try {
        const erc20 = await alchemy.core.getTokenBalances(address);
        const detailed = await Promise.all(
          erc20.tokenBalances
            .filter((t) => t.tokenBalance)
            .slice(0, 25)
            .map(async (t) => {
              const meta = await alchemy.core.getTokenMetadata(t.contractAddress);
              const decimals = meta.decimals ?? 18;
              const raw = t.tokenBalance as string; // hex string
              let amount = 0;
              try {
                amount = Number(BigInt(raw)) / Math.pow(10, decimals);
              } catch {
                amount = 0;
              }
              const symbol = (meta.symbol || 'TOKEN').toUpperCase();
              const name = meta.name || t.contractAddress.slice(0, 6);
              const usd = symbol === 'ETH' ? amount * pricesUsd.ETH
                : symbol === 'USDC' ? amount * pricesUsd.USDC
                : symbol === 'MATIC' ? amount * pricesUsd.MATIC
                : undefined;
              return { symbol, name, balance: amount.toFixed(4), usd };
            })
        );

        // Prepend ETH balance
        const ethItem = {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: realBalance.toFixed(4),
          usd: pricesUsd.ETH ? realBalance * pricesUsd.ETH : undefined,
        };
        setTokenBalances([ethItem, ...detailed]);
      } catch {
        setTokenBalances([]);
      }

      // Recent transfers (incoming + outgoing)
      try {
        const incoming = await alchemy.core.getAssetTransfers({
          toAddress: address,
          category: ['external', 'erc20', 'erc721', 'erc1155'] as unknown as any,
          withMetadata: true,
          maxCount: 15 as unknown as any,
          order: 'desc' as unknown as any,
        });
        const outgoing = await alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: ['external', 'erc20', 'erc721', 'erc1155'] as unknown as any,
          withMetadata: true,
          maxCount: 15 as unknown as any,
          order: 'desc' as unknown as any,
        });
        const merged = [...(incoming.transfers || []), ...(outgoing.transfers || [])]
          .sort((a: any, b: any) => (new Date(b.metadata?.blockTimestamp || '').getTime() - new Date(a.metadata?.blockTimestamp || '').getTime()))
          .slice(0, 20);
        setTxs(merged);
      } catch {
        setTxs([]);
      }
    };

    fetchOnChainData();
  }, [address, realBalance, pricesUsd]);

  const handleSend = () => {
    const amount = parseFloat(sendAmount);
    if (!sendAmount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!sendAddress) {
      toast.error('Please enter a recipient address');
      return;
    }
    if (amount > realBalance) {
      toast.error('Insufficient funds');
      return;
    }
    onSend(amount);
    setShowSendModal(false);
    setSendAmount('');
    setSendAddress('');
  };

  const handleReceive = () => {
    // Try to copy, but don't fail if clipboard is blocked
    try {
      navigator.clipboard.writeText('0x742d35a8f9e12b45c6d8e3f7a4f3');
      onReceive();
    } catch (error) {
      // Fallback - just show success message
      toast.success('Address displayed below - manually copy if needed');
    }
    setShowReceiveModal(false);
  };

  const handleConvert = () => {
    const amount = parseFloat(convertFromAmount);
    if (!convertFromAmount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > realBalance) {
      toast.error('Insufficient funds');
      return;
    }
    onConvert(amount, convertFromCurrency, convertToCurrency);
    setConvertFromAmount('');
  };

  // Network names mapping
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet'
      case 11155111: return 'Sepolia Testnet'
      case 137: return 'Polygon'
      case 56: return 'BSC'
      default: return 'Unknown Network'
    }
  }

  // Use real wallet data
  const wallets = [
    { 
      name: 'Connected Wallet', 
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected', 
      balance: realBalance ? `${realBalance.toFixed(4)} ETH` : '0 ETH', 
      usd: realBalance && pricesUsd.ETH ? `$${(realBalance * pricesUsd.ETH).toFixed(2)}` : '$0', 
      connected: isConnected 
    }
  ];

  const assets = [
    { name: 'Ethereum', symbol: 'ETH', balance: '12.5', usd: '$21,450', change: '+5.2%', logo: '⟠' },
    { name: 'USD Coin', symbol: 'USDC', balance: '5,420', usd: '$5,420', change: '+0.1%', logo: '◎' },
    { name: 'Polygon', symbol: 'MATIC', balance: '1,234', usd: '$987', change: '-2.3%', logo: '⬡' }
  ];

  const transactions = [
    { type: 'Received', amount: '+2.5 ETH', from: '0x742d...a4f3', date: '2 hours ago', status: 'completed' },
    { type: 'Sent', amount: '-0.8 ETH', to: '0x8f3b...2e1a', date: '1 day ago', status: 'completed' },
    { type: 'Minted', amount: '-0.0045 ETH', to: 'NFT Contract', date: '2 days ago', status: 'completed' },
    { type: 'Received', amount: '+1.2 ETH', from: '0x9a2c...5d7f', date: '3 days ago', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl">Wallet</h1>
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm">Not Connected</span>
            </div>
          )}
        </div>

        {/* Total Balance Card */}
        <GlassCard className="p-6 mb-6 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <p className="text-white/60 text-sm mb-2">Total Balance</p>
            <div className="flex items-end gap-2 mb-1">
              <h2 className="text-5xl">{realBalance.toFixed(4)}</h2>
              <span className="text-xl text-white/60 mb-1">ETH</span>
            </div>
              <p className="text-white/60 text-sm mb-1">
                ≈ {pricesUsd.ETH ? `$${(realBalance * pricesUsd.ETH).toFixed(2)}` : '—'}
              </p>
            <p className="text-green-400 text-sm mb-6">+$1,234 (3.6%) this month</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSendModal(true)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center gap-2 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
              >
                <ArrowUpRight className="w-5 h-5" />
                Send
              </button>
              <button 
                onClick={() => setShowReceiveModal(true)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-400/30 text-purple-400 flex items-center justify-center gap-2 hover:from-purple-500/30 hover:to-magenta-500/30 transition-all"
              >
                <ArrowDownLeft className="w-5 h-5" />
                Receive
              </button>
              <button 
                onClick={() => setActiveTab('convert')}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-magenta-500/20 to-pink-500/20 border border-magenta-400/30 text-magenta-400 flex items-center justify-center gap-2 hover:from-magenta-500/30 hover:to-pink-500/30 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Convert
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Add this after the balance display */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-white/60 text-sm">{getNetworkName(chainId)}</span>
          <button 
            onClick={() => switchChain({ chainId: 11155111 })} // Switch to Sepolia
            className="text-cyan-400 text-xs hover:text-cyan-300"
          >
            Switch Network
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['assets', 'transactions', 'convert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                px-6 py-3 rounded-full backdrop-blur-xl border transition-all whitespace-nowrap capitalize
                ${activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20 border-cyan-400/50 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top Coins Widget */}
        {activeTab === 'assets' && topCoins?.length > 0 && (
          <GlassCard className="p-4 mb-4">
            <h3 className="mb-3">Top Coins</h3>
            <div className="space-y-3">
              {topCoins.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.image} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-sm">{c.name} ({String(c.symbol).toUpperCase()})</div>
                      <div className="text-xs text-white/60">Rank #{c.market_cap_rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>${c.current_price?.toLocaleString?.() || c.current_price}</div>
                    <div className={`text-xs ${c.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {c.price_change_percentage_24h?.toFixed?.(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Assets Tab (real on-chain) */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            {tokenBalances.length === 0 ? (
              <GlassCard className="p-4 text-center text-white/60">No assets found</GlassCard>
            ) : (
              tokenBalances.map((asset, i) => (
                <GlassCard key={`${asset.symbol}-${i}`} className="p-4 hover:bg-white/10 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                    <h4 className="mb-1">{asset.name}</h4>
                    <p className="text-white/60 text-sm">{asset.balance} {asset.symbol}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-sm">{asset.usd ? `$${asset.usd.toFixed(2)}` : '—'}</p>
                    </div>
                </div>
              </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Transactions Tab (real on-chain) */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {txs.length === 0 ? (
              <GlassCard className="p-4 text-center text-white/60">No recent activity</GlassCard>
            ) : (
              txs.map((t, idx) => {
                const isIn = String(t.to || '').toLowerCase() === String(address || '').toLowerCase();
                const label = (t.category || 'tx').toUpperCase();
                const ts = t.metadata?.blockTimestamp ? new Date(t.metadata.blockTimestamp).toLocaleString() : '';
                const amountEth = t.value ? `${t.value} ETH` : '';
                return (
                  <GlassCard key={idx} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">{label}</h4>
                        <p className="text-white/60 text-xs">{ts}</p>
                      </div>
                      <div className={`text-right ${isIn ? 'text-green-400' : 'text-white'}`}>
                        <p>{isIn ? '+' : '-'}{amountEth}</p>
                        <a className="text-xs text-cyan-400" target="_blank" rel="noreferrer" href={`https://sepolia.etherscan.io/tx/${t.hash}`}>View</a>
                  </div>
                </div>
              </GlassCard>
                );
              })
            )}
          </div>
        )}

        {/* Convert Tab */}
        {activeTab === 'convert' && (
          <div>
            <GlassCard className="p-6 mb-6">
              <h3 className="mb-4">Convert Crypto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">From</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={convertFromAmount}
                      onChange={(e) => setConvertFromAmount(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
                    />
                    <select 
                      value={convertFromCurrency}
                      onChange={(e) => setConvertFromCurrency(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
                    >
                      <option>ETH</option>
                      <option>USDC</option>
                      <option>MATIC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                      const temp = convertFromCurrency;
                      setConvertFromCurrency(convertToCurrency);
                      setConvertToCurrency(temp);
                    }}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2">To (Estimated)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={(() => {
                        const amt = parseFloat(convertFromAmount || '');
                        const rate = getRate(convertFromCurrency, convertToCurrency);
                        if (!convertFromAmount || !amt || !rate) return '';
                        return (amt * rate).toFixed(6);
                      })()}
                      readOnly
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
                    />
                    <select 
                      value={convertToCurrency}
                      onChange={(e) => setConvertToCurrency(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
                    >
                      <option>USDC</option>
                      <option>ETH</option>
                      <option>MATIC</option>
                    </select>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60 text-sm">Exchange Rate</span>
                <span className="text-sm">
                  {isLoadingRates ? 'Loading...' : (() => {
                    const r = getRate('ETH', 'USDC');
                    return r ? `1 ETH = ${r.toFixed(4)} USDC` : '—';
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Network Fee</span>
                <span className="text-sm">0.002 ETH</span>
              </div>
            </GlassCard>

            <NeonButton onClick={handleConvert} className="w-full">
              Convert Now
            </NeonButton>
          </div>
        )}

        {/* Connected Wallets */}
        <div className="mt-8">
          <h3 className="text-lg mb-4 text-white/90">Connected Wallets</h3>
          {isConnected ? (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <GlassCard key={wallet.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1">{wallet.name}</h4>
                      <p className="text-white/60 text-sm font-mono">{address}</p>
                  </div>
                    <div className="text-right">
                      <p className="text-cyan-400">{wallet.balance}</p>
                      <p className="text-white/60 text-sm">{wallet.usd}</p>
                    </div>
                </div>
              </GlassCard>
            ))}
          </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <div className="text-white/60 mb-4">
                <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg mb-2">No Wallet Connected</p>
                <p className="text-sm">Connect your wallet to view your assets and manage your portfolio</p>
              </div>
          <NeonButton 
            variant="outline" 
                className="w-full"
                onClick={() => toast.info('Please connect your wallet in the Sign In screen')}
          >
            <span className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
                  Connect Wallet
            </span>
          </NeonButton>
            </GlassCard>
          )}
        </div>

        {/* NFT Collection */}
        {isConnected && (
          <div className="mt-8">
            <NFTGallery />
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <GlassCard className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Send ETH</h3>
              <button onClick={() => setShowSendModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/80 mb-2">Amount (ETH)</label>
              <input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
              <p className="text-white/40 text-xs mt-2">Available: {realBalance.toFixed(2)} ETH</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/80 mb-2">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </div>

            <div className="flex gap-3">
              <NeonButton onClick={() => setShowSendModal(false)} variant="secondary" className="flex-1">
                Cancel
              </NeonButton>
              <NeonButton onClick={handleSend} className="flex-1">
                Send
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <GlassCard className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Receive ETH</h3>
              <button onClick={() => setShowReceiveModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl mb-4 flex items-center justify-center">
                <div className="text-4xl">📱</div>
              </div>
              <p className="text-white/60 text-sm mb-4">Scan QR code or select address to copy</p>
              <GlassCard className="p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={handleReceive}>
                <p className="text-sm break-all font-mono select-all">0x742d35a8f9e12b45c6d8e3f7a4f3</p>
              </GlassCard>
              <p className="text-white/40 text-xs mt-2">Tap address or button below to copy</p>
            </div>

            <NeonButton onClick={handleReceive} className="w-full">
              Copy Address
            </NeonButton>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
