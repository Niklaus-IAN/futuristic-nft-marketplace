import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, bsc } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: '8fd51b1c3c3c957310645dd42df43f5d', // Get from https://cloud.walletconnect.com
    }),
    coinbaseWallet({
      appName: 'KryptoArt NFT Marketplace',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
})