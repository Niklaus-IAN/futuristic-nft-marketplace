import axios from "axios";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export async function uploadToIPFS(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

  const ipfsHash = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

export async function uploadMetadata(metadata: any) {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

  const ipfsHash = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export async function createNFTMetadata(
  name: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string }>
): Promise<string> {
  const metadata: NFTMetadata = {
    name,
    description,
    image: imageUrl,
    attributes,
  };

  return await uploadMetadata(metadata);
}



