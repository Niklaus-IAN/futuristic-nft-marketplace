# IPFS Setup Guide

## 🔧 **Setup Pinata for IPFS Uploads**

### **1. Get Pinata API Keys**
1. Go to [Pinata Cloud](https://pinata.cloud)
2. Create a free account
3. Go to API Keys section
4. Create a new API key
5. Copy your **JWT Token**

### **2. Create Environment File**
Create a `.env` file in your project root:

```bash
# .env
VITE_PINATA_JWT=your_actual_jwt_token_here
```

### **3. Install Dependencies**
```bash
pnpm install axios
```

### **4. Test the Setup**
1. Start your app: `pnpm dev`
2. Go to Create NFT screen
3. Upload an image
4. Click "Upload to IPFS"
5. Check browser console for any errors

## 🎯 **What This Enables**

- ✅ **Real image uploads** to IPFS
- ✅ **Metadata creation** with attributes
- ✅ **IPFS URLs** for blockchain minting
- ✅ **Decentralized storage** for your NFTs

## 🚀 **Next Steps**

After setting up IPFS, you'll be ready for:
- Smart contract deployment
- NFT minting functionality
- Marketplace integration



