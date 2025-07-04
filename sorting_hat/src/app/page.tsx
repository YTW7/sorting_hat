// "use client";
// import { useState } from "react";
// import db from "./db.json"
// import { PublicKey } from "@solana/web3.js";
// import { createGenericFile, createSignerFromKeypair, percentAmount, signerIdentity } from "@metaplex-foundation/umi";
// import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
// import { useWallet } from "@solana/wallet-adapter-react";


// export default function Home() {
//   const [userWallet, setUserWallet]=useState("");
//   const [userName, setUserName]=useState("");
//   const [loading, setLoading]=useState(false);
//   const [isWhitelisted, setIsWhitelisted]=useState(false);
//   const RPC_ENDPOINT = "https://devnet.helius-rpc.com/?api-key=15177c0d-0897-46ea-a2ef-fbf919b9645d";
//   const umi = createUmi(RPC_ENDPOINT);
//   const {wallet, publicKey}=useWallet();

// //   const handleChange= (e: { target: { value: string; }; }) => {
// //     setUserWallet(e.target.value);
// // }

// // gryff uri: hhttps://devnet.irys.xyz/2HP5eXEsFigMzxFKnP18Ks3AhxmoKFq3EQzUeKrreBM2
// // slyth uri: https://devnet.irys.xyz/G1K16usjBHnN9d7MPDZR48PXnQxy92Q3BDX5yw29krw2
// // raven uri: https://devnet.irys.xyz/3L6VaBR1VPh2hBuNbPjPzgv7kFkdkCBPwvS3dmbBsqUZ
// // huffle uri: https://devnet.irys.xyz/D2cT6RkM6VVWHLS25XTLMPjCShdYUuZ33bZ73ieFRuSx
// // collection uri: https://devnet.irys.xyz/3yUNVDJBUDvcszW2XRbAZf5Sz8zrqnKF1RYamuNKifW4
// const houses = [
//   {
//     name: "Gryffindor",
//     trait: "Courage",
//     imageUri: "https://devnet.irys.xyz/2HP5eXEsFigMzxFKnP18Ks3AhxmoKFq3EQzUeKrreBM2",
//   },
//   {
//     name: "Slytherin",
//     trait: "Ambition",
//     imageUri: "https://devnet.irys.xyz/G1K16usjBHnN9d7MPDZR48PXnQxy92Q3BDX5yw29krw2",
//   },
//   {
//     name: "Hufflepuff",
//     trait: "Loyalty",
//     imageUri: "https://devnet.irys.xyz/D2cT6RkM6VVWHLS25XTLMPjCShdYUuZ33bZ73ieFRuSx",
//   },
//   {
//     name: "Ravenclaw",
//     trait: "Wisdom",
//     imageUri: "https://devnet.irys.xyz/3L6VaBR1VPh2hBuNbPjPzgv7kFkdkCBPwvS3dmbBsqUZ",
//   },
// ];
// async function mintRandomHouseNft(userName: string, collectionMint: PublicKey) {
// const selectedHouse = houses[Math.floor(Math.random() * houses.length)];

// const metadata = {
//   name: `${selectedHouse.name} NFT`,
//   symbol: "HAT",
//   description: `An exclusive NFT for ${userName}, placed in ${selectedHouse.name}.`,
//   image: selectedHouse.imageUri,
//   attributes: [
//     { trait_type: "House", value: selectedHouse.name },
//     { trait_type: selectedHouse.trait, value: "High" },
//     { trait_type: "Name", value: userName }
//   ],
//   properties: {
//     files: [{ uri: selectedHouse.imageUri, type: "image/png" }],
//     category: "image"
//   }
// };
// const metadataJson = Buffer.from(JSON.stringify(metadata));
// const genericMetadata = createGenericFile(metadataJson, "metadata.json", {
//   contentType: "application/json"
// });
// const [metadataUri] = await umi.uploader.upload([genericMetadata]);

// const houseNft = await createNft(umi, {
//     uri: metadataUri,
//     name: metadata.name,
//     symbol: metadata.symbol,
//     sellerFeeBasisPoints: percentAmount(500),
//     collection: {
//       key: collectionMint,
//       verified: false
//     },
//     creators: [
//       {
//         address: new PublicKey("EgfqevbTP7QoyUd8egpaCpA888WBLveVS8aPZGzrioJt"),
//         verified: true,
//         share: 100
//       }
//     ]
//   }).sendAndConfirm(umi);

//   await setAndVerifyCollection(umi, {
//     mint: houseNft.nft.publicKey,
//     collectionMint,
//     collectionAuthority: signer
//   }).sendAndConfirm(umi);

//   console.log(`✅ Minted ${selectedHouse.name} NFT for ${userName}`);
// }


// const handleMint=() =>{
//   try{
//   //check WL
//   const isWL =  db.wallets.some((w) => w.address===userWallet);
//   setIsWhitelisted(isWL);

//   //use random out of 4

//   //mint to collection
  
//   //display mint
//   }
//   catch{
   
//   }
  
// }

//   return (
//     <>
//     <div>I'm Sorting Hat, and I will place you in of our 4 prestigious houses!</div>
//     <div>Houses include:</div>
//     <ul>
//       <li>Gryffindor</li>
//       <li>Hufflepuff</li>
//       <li>Ravenclaw</li>
//       <li>Slytherin</li>
//     </ul>
//     <br/>
//     <div>Get into one of the prestigious house by minting your exclusive NFT</div>
//     <br/>
//      <label htmlFor="username">Builder Name:</label>
//     <input type="text" id="username" name="username" 
//       placeholder="Jeff aka Japarjam"
//       value={userName}
//       onChange={(e) => setUserName(e.target.value)} 
//       required/>
//     <br/>
//     <label htmlFor="wallet">Wallet:</label>
//     <input type="text" id="wallet" name="wallet" 
//       placeholder="Enter here like Efjdh...JHjd"
//       value={userWallet}
//       onChange={(e) => setUserWallet(e.target.value)} 
//       required/>
//      <button className="bg-green-300" onClick={handleMint}>Mint</button>
//      {isWhitelisted && <p className="text-green-600">✅ Whitelisted!</p>}
     
      
//     </>
//   );
// }
"use client";

import { useState } from "react";
import db from "./db.json";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

async function mintRandomHouseNft(userName: string,) {
  try {
    const response = await fetch('/api/mint-nft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName:userName,
      }),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("API call error:", err);
    return { success: false, error: err?.toString() };
  }
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const wallet = useWallet();
  const { publicKey, connected } = wallet;

  const handleMint = async () => {
    setLoading(true);
    setStatusMsg("");

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

    try {
      const result = await mintRandomHouseNft(userName.trim(), publicKey.toBase58());
      
      if (result?.success) {
        setStatusMsg(`✅ Congratulations! You've been sorted into ${result.house}! 
          NFT Mint: ${result.mint}
          Metadata: ${result.metadataUri}`);
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
            👤 Builder Name:
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
            🦊 Connected Wallet:
          </label>
          <input
            type="text"
            id="wallet"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            value={publicKey?.toBase58() || "Not connected"}
            readOnly
          />
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

        {isWhitelisted && (
          <p className="text-green-600 text-center font-medium">
            ✅ Wallet is whitelisted!
          </p>
        )}

        {statusMsg && (
          <div className="mt-4 p-3 border rounded-md">
            <p className="text-sm whitespace-pre-line">{statusMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}