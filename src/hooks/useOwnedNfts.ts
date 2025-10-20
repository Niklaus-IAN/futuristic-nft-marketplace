import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Alchemy, Network } from 'alchemy-sdk';

export interface OwnedNftItem {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contract: {
    name: string;
    address: string;
  };
  tokenUri: string;
}

const getIpfsGateways = (hash: string): string[] => [
  `https://ipfs.io/ipfs/${hash}`,
  `https://gateway.pinata.cloud/ipfs/${hash}`,
  `https://cloudflare-ipfs.com/ipfs/${hash}`,
  `https://dweb.link/ipfs/${hash}`,
  `https://ipfs.filebase.io/ipfs/${hash}`,
  `https://nftstorage.link/ipfs/${hash}`,
];

const normalizeIpfsUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  return url;
};

export function useOwnedNfts() {
  const { address } = useAccount();

  const query = useQuery<{ items: OwnedNftItem[] }>(
    {
      queryKey: ['owned-nfts', address],
      enabled: Boolean(address),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Back off on 500s, retry up to 3 times
        const msg = String(error?.message || '');
        if (msg.includes('500') || msg.includes('Internal Server Error')) {
          return failureCount < 3;
        }
        // Retry once for transient issues
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
      queryFn: async () => {
        if (!address) return { items: [] };
        const settings = {
          apiKey: (import.meta as any).env.VITE_ALCHEMY_API_KEY?.replace('https://eth-sepolia.g.alchemy.com/v2/', ''),
          network: Network.ETH_SEPOLIA,
        };
        const alchemy = new Alchemy(settings);
        const data = await alchemy.nft.getNftsForOwner(address);
        if (!data || data.ownedNfts === undefined) {
          throw new Error('Alchemy API returned invalid data');
        }

        const items: OwnedNftItem[] = await Promise.all(
          data.ownedNfts.map(async (nft: any) => {
            let imageUrl = '';
            let name = nft.name || `Unnamed NFT #${nft.tokenId}`;
            let description = nft.description || '';

            // Try metadata across multiple gateways
            if (nft.tokenUri) {
              try {
                const buildMetadataUrls = (uri: string): string[] => {
                  if (!uri) return [];
                  if (uri.startsWith('ipfs://')) {
                    const hash = uri.replace('ipfs://', '');
                    return getIpfsGateways(hash);
                  }
                  if (uri.includes('/ipfs/')) {
                    const hash = uri.split('/ipfs/')[1];
                    return getIpfsGateways(hash);
                  }
                  return [uri];
                };

                const candidateUrls = buildMetadataUrls(nft.tokenUri);
                for (const url of candidateUrls) {
                  try {
                    const response = await fetch(url, { cache: 'no-store' });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const metadata = await response.json();
                    name = metadata.name || name;
                    description = metadata.description || description;
                    const rawImageUrl = metadata.image || metadata.image_url || metadata.imageURI || (metadata.properties && (metadata.properties.image || metadata.properties.image_url));
                    if (rawImageUrl) {
                      if (rawImageUrl.startsWith('ipfs://')) {
                        const hash = rawImageUrl.replace('ipfs://', '');
                        imageUrl = getIpfsGateways(hash)[0];
                      } else if (rawImageUrl.includes('/ipfs/')) {
                        const hash = rawImageUrl.split('/ipfs/')[1];
                        imageUrl = getIpfsGateways(hash)[0];
                      } else {
                        imageUrl = rawImageUrl;
                      }
                    }
                    break;
                  } catch {
                    // try next url
                    continue;
                  }
                }
              } catch {
                // ignore
              }
            }

            if (!imageUrl) {
              const media0 = (nft as any)?.media?.[0];
              imageUrl = normalizeIpfsUrl(
                media0?.gateway || media0?.raw || (nft as any)?.image?.cachedUrl || (nft as any)?.image?.originalUrl
              );
            }

            if (name === `Unnamed NFT #${nft.tokenId}` && nft.name) {
              name = nft.name;
            } else if (name === `Unnamed NFT #${nft.tokenId}`) {
              name = `${nft.contract.name} #${nft.tokenId}`;
            }
            if (!description && nft.description) {
              description = nft.description;
            }

            return {
              tokenId: nft.tokenId,
              name,
              description,
              image: imageUrl,
              contract: {
                name: nft.contract.name || 'Unknown Contract',
                address: nft.contract.address,
              },
              tokenUri: nft.tokenUri || '',
            };
          })
        );

        return { items };
      },
    }
  );

  return {
    nfts: query.data?.items || [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load NFTs from blockchain' : null,
    refetch: query.refetch,
  };
}


