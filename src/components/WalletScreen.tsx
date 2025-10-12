import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet as WalletIcon, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { toast } from 'sonner';

interface WalletScreenProps {
  balance: number;
  onSend: (amount: number) => void;
  onReceive: () => void;
  onConvert: (fromAmount: number, fromCurrency: string, toCurrency: string) => void;
}

export function WalletScreen({ balance, onSend, onReceive, onConvert }: WalletScreenProps) {
  const [activeTab, setActiveTab] = useState<'assets' | 'transactions' | 'convert'>('assets');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [convertFromAmount, setConvertFromAmount] = useState('');
  const [convertFromCurrency, setConvertFromCurrency] = useState('ETH');
  const [convertToCurrency, setConvertToCurrency] = useState('USDC');

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
    if (amount > balance) {
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
    if (amount > balance) {
      toast.error('Insufficient funds');
      return;
    }
    onConvert(amount, convertFromCurrency, convertToCurrency);
    setConvertFromAmount('');
  };

  const wallets = [
    { name: 'MetaMask', address: '0x742d...a4f3', balance: '12.5 ETH', usd: '$21,450', connected: true },
    { name: 'Coinbase Wallet', address: '0x8f3b...2e1a', balance: '5.2 ETH', usd: '$8,932', connected: true },
    { name: 'Trust Wallet', address: 'Not Connected', balance: '0 ETH', usd: '$0', connected: false }
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
        <h1 className="text-3xl mb-6">Wallet</h1>

        {/* Total Balance Card */}
        <GlassCard className="p-6 mb-6 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <p className="text-white/60 text-sm mb-2">Total Balance</p>
            <div className="flex items-end gap-2 mb-1">
              <h2 className="text-5xl">{balance.toFixed(2)}</h2>
              <span className="text-xl text-white/60 mb-1">ETH</span>
            </div>
            <p className="text-white/60 text-sm mb-1">≈ ${(balance * 1716).toFixed(2)}</p>
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

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            {assets.map((asset) => (
              <GlassCard key={asset.symbol} className="p-4 hover:bg-white/10 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                    {asset.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{asset.name}</h4>
                    <p className="text-white/60 text-sm">{asset.balance} {asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1">{asset.usd}</p>
                    <p className={`text-sm ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <GlassCard key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'Received' ? 'bg-green-500/20' : tx.type === 'Sent' ? 'bg-red-500/20' : 'bg-purple-500/20'
                    }`}>
                      {tx.type === 'Received' ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-400" />
                      ) : tx.type === 'Sent' ? (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      ) : (
                        <WalletIcon className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm">{tx.type}</h4>
                      <p className="text-white/60 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}>{tx.amount}</p>
                    <p className="text-white/40 text-xs capitalize">{tx.status}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
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
                      value={convertFromAmount ? (parseFloat(convertFromAmount) * 1716).toFixed(2) : ''}
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
                <span className="text-sm">1 ETH = 1,716 USDC</span>
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
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <GlassCard key={wallet.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1">{wallet.name}</h4>
                    <p className="text-white/60 text-sm">{wallet.address}</p>
                  </div>
                  {wallet.connected ? (
                    <div className="text-right">
                      <p className="text-cyan-400">{wallet.balance}</p>
                      <p className="text-white/60 text-sm">{wallet.usd}</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toast.success('Wallet connected!')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 text-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          <NeonButton 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => toast.info('Wallet connection initiated')}
          >
            <span className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add Wallet
            </span>
          </NeonButton>
        </div>
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
              <p className="text-white/40 text-xs mt-2">Available: {balance.toFixed(2)} ETH</p>
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
