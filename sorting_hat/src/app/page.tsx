"use client";

import { useState } from "react";
import db from "./db.json";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface NFTData {
  success: boolean;
  house: string;
  mint: string;
  signature: string;
  metadataUri: string;
}

interface NFTDisplayProps {
  nftData: NFTData | null;
}

async function mintRandomHouseNft(userName: string, userWallet: string) {
  try {
    const response = await fetch('/api/mint-nft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName:userName,
        userWallet: userWallet
      }),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("API call error:", err);
    return { success: false, error: err?.toString() };
  }
}
interface NFTDisplayProps {
  nftData: NFTData | null;
}
// NFT Display Component
function NFTDisplay({ nftData }: NFTDisplayProps) {
  if (!nftData) return null;

  const getHouseImage = (houseName: string): string => {
    const houses = {
      "Gryffindor": "https://devnet.irys.xyz/2HP5eXEsFigMzxFKnP18Ks3AhxmoKFq3EQzUeKrreBM2",
      "Slytherin": "https://devnet.irys.xyz/G1K16usjBHnN9d7MPDZR48PXnQxy92Q3BDX5yw29krw2",
      "Hufflepuff": "https://devnet.irys.xyz/D2cT6RkM6VVWHLS25XTLMPjCShdYUuZ33bZ73ieFRuSx",
      "Ravenclaw": "https://devnet.irys.xyz/3L6VaBR1VPh2hBuNbPjPzgv7kFkdkCBPwvS3dmbBsqUZ",
    };
    return houses[houseName as keyof typeof houses] || "";
  };

  const getHouseEmoji = (houseName: string): string => {
    const emojis = {
      "Gryffindor": "🦁",
      "Slytherin": "🐍", 
      "Hufflepuff": "🦡",
      "Ravenclaw": "🦅"
    };
    return emojis[houseName as keyof typeof emojis] || "🎭";
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
      <h3 className="text-xl font-bold text-center mb-4">
        🎉 Your House NFT Has Been Minted!
      </h3>
      
      <div className="flex flex-col items-center space-y-4">
        {/* NFT Image */}
        <div className="relative">
          <img 
            src={getHouseImage(nftData.house)} 
            alt={`${nftData.house} House NFT`}
            className="w-48 h-48 object-cover rounded-lg shadow-lg border-4 border-white"
            // onError={(e) => {
            //   e.target.src = "/placeholder-nft.png"; // Fallback image
            // }}
          />
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
            <span className="text-2xl">{getHouseEmoji(nftData.house)}</span>
          </div>
        </div>

        {/* NFT Details */}
        <div className="text-center space-y-2">
          <h4 className="text-lg font-semibold text-purple-800">
            {getHouseEmoji(nftData.house)} Welcome to {nftData.house}!
          </h4>
          
          <div className="bg-white rounded-lg p-3 shadow-md">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">NFT Address:</span>
            </p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {nftData.mint}
            </p>
          </div>

          <div className="flex space-x-4 text-sm">
            <a 
              href={`https://explorer.solana.com/address/${nftData.mint}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
            >
              🔍 View on Explorer
            </a>
            <a 
              href={nftData.metadataUri}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
            >
              📄 View Metadata
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [mintedNFT, setMintedNFT] = useState(null); 

  const wallet = useWallet();
  const { publicKey, connected } = wallet;

  const handleMint = async () => {
    setLoading(true);
    setStatusMsg("");
    setMintedNFT(null);

    if (!connected || !publicKey) {
      setStatusMsg("🚫 Please connect your wallet first.");
      setLoading(false);
      return;
    }

    // Whitelist check
    const isWL = db.wallets.some(w => 
      w.address.toLowerCase() === publicKey.toBase58().toLowerCase()
    );
    setIsWhitelisted(isWL);

    if (!isWL) {
      setStatusMsg("❌ Your wallet is not whitelisted.");
      setLoading(false);
      return;
    }

    if (!userName.trim()) {
      setStatusMsg("❌ Please enter your name.");
      setLoading(false);
      return;
    }

    console.log("publicKey.toString()",publicKey.toString())
    try {
      const result = await mintRandomHouseNft(userName.trim(), publicKey.toString());
      
      if (result?.success) {
        // setStatusMsg(`✅ Congratulations! You've been sorted into ${result.house}! 
        //   NFT Mint: ${result.mint}
        //   Metadata: ${result.metadataUri}`);
          setMintedNFT(result);
      } else {
        setStatusMsg(`❌ Mint failed: ${result?.error}`);
      }
    } catch (error) {
      setStatusMsg(`❌ Unexpected error: ${error?.toString()}`);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
      <WalletMultiButton style={{height:"1.5rem", paddingInline:"0.5rem", backgroundColor:"rgb(155 135 245)"}}>
              {!publicKey? "Connect Wallet" : `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
            </WalletMultiButton>
        <h1 className="text-3xl font-bold mb-2">🧙‍♂️ The Sorting Hat</h1>
        <p className="text-lg">I will place you in one of our 4 prestigious houses!</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Houses include:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>🦁 Gryffindor - Courage</li>
          <li>🐍 Slytherin - Ambition</li>
          <li>🦡 Hufflepuff - Loyalty</li>
          <li>🦅 Ravenclaw - Wisdom</li>
        </ul>
      </div>

      <div className="mb-6">
        <p className="text-center text-lg">
          Get sorted into one of the prestigious houses by minting your exclusive NFT!
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Builder Name:
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your name (e.g., Jeff aka Japarjam)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="wallet" className="block text-sm font-medium mb-2">
             Connected Wallet:
          </label>
          <div style={{display:"flex", flexDirection:"row"}}>
          <input
            type="text"
            id="wallet"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            value={publicKey?.toBase58() || "Not connected"}
            readOnly
          />
                {isWhitelisted && (
          <p className="text-green-600 text-center font-medium">
            ✅ Wallet is whitelisted!
          </p>
        )}
        </div>
        </div>

        <button
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            loading || !connected
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleMint}
          disabled={loading || !connected}
        >
          {loading ? "🔄 Minting..." : "🎩 Mint My House NFT"}
        </button>



        {statusMsg && (
          <div className="mt-4 p-3 border rounded-md">
            <p className="text-sm whitespace-pre-line">{statusMsg}</p>
          </div>
        )}

        {/* Display the minted NFT */}
        <NFTDisplay nftData={mintedNFT} />
      </div>
    </div>
  );
}