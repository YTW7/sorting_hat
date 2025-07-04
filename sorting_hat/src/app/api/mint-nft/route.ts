import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import {
  percentAmount,
  publicKey as umiPublicKey,
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createNft,  mplTokenMetadata, } from "@metaplex-foundation/mpl-token-metadata";
import path from "path";
// import { splAssociatedToken } from '@metaplex-foundation/mpl-essentials';
import { promises as fs } from "fs";
// import { transferV1 } from '@metaplex-foundation/mpl-core';
// import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
const RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=15177c0d-0897-46ea-a2ef-fbf919b9645d";
const COLLECTION_MINT = new PublicKey(
  "3uQogb4AA4XVGkVmiY1kpwLuY2P9oUk2MjGSbTjeENU3"
);

const houses = [
  {
    name: "Gryffindor",
    trait: "Courage",
    imageUri:
      "https://devnet.irys.xyz/2HP5eXEsFigMzxFKnP18Ks3AhxmoKFq3EQzUeKrreBM2",
  },
  {
    name: "Slytherin",
    trait: "Ambition",
    imageUri:
      "https://devnet.irys.xyz/G1K16usjBHnN9d7MPDZR48PXnQxy92Q3BDX5yw29krw2",
  },
  {
    name: "Hufflepuff",
    trait: "Loyalty",
    imageUri:
      "https://devnet.irys.xyz/D2cT6RkM6VVWHLS25XTLMPjCShdYUuZ33bZ73ieFRuSx",
  },
  {
    name: "Ravenclaw",
    trait: "Wisdom",
    imageUri:
      "https://devnet.irys.xyz/3L6VaBR1VPh2hBuNbPjPzgv7kFkdkCBPwvS3dmbBsqUZ",
  },
];

// ✅ Correct handler for App Router
export async function POST(req: NextRequest) {
  try {
    const { userName, userWallet } = await req.json();

    const secretKey = JSON.parse(process.env.WALLET_PK || "[]");
    if (!secretKey.length) {
      throw new Error("Missing WALLET_PK in environment variables");
    }

    const filePath = path.resolve(process.cwd(), "src/app/minted-wallets.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const mintedWallets = JSON.parse(fileData) as string[];
    if (mintedWallets.includes(userWallet)) {
        
      return NextResponse.json({
        success: false,
        error: "This wallet has already minted a house NFT.",
      }, { status: 403 });
    }

    const umi = createUmi(RPC_ENDPOINT);
    umi.use(mplTokenMetadata());
    // umi.use(splAssociatedToken());
    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(secretKey)
    );
    // const keypairATA = Keypair.fromSecretKey(new Uint8Array(secretKey));
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(irysUploader());
    umi.use(signerIdentity(signer));

    const selectedHouse =
      houses[Math.floor(Math.random() * houses.length)];

    const metadata = {
      name: `${selectedHouse.name} NFT`,
      symbol: "HAT",
      description: `An exclusive NFT for ${userName}, placed in ${selectedHouse.name}.`,
      image: selectedHouse.imageUri,
      attributes: [
        { trait_type: "House", value: selectedHouse.name },
        { trait_type: selectedHouse.trait, value: "High" },
        { trait_type: "Name", value: userName },
      ],
      properties: {
        files: [{ uri: selectedHouse.imageUri, type: "image/png" }],
        category: "image",
      },
      creators: [],
    };

    const metadataUri = await umi.uploader.uploadJson(metadata);
    const mintKeypair = generateSigner(umi);

    const createNftResult = await createNft(umi, {
      mint: mintKeypair,
      uri: metadataUri,
      name: metadata.name,
      symbol: metadata.symbol,
      sellerFeeBasisPoints: percentAmount(5),
      collection: {
        key: umiPublicKey(COLLECTION_MINT),
        verified: false,
      },
      creators: [
        {
          address: umi.identity.publicKey,
          verified: true,
          share: 100,
        },
      ],
      tokenOwner: umiPublicKey(userWallet)
    }).sendAndConfirm(umi);
    // console.log("createNftResult,",createNftResult.signature)

    mintedWallets.push(userWallet);
    await fs.writeFile(filePath, JSON.stringify(mintedWallets, null, 2));

    return NextResponse.json({
      success: true,
      house: selectedHouse.name,
      mint: mintKeypair.publicKey.toString(),
      signature: createNftResult.signature,
      metadataUri,
    });
  } catch (error) {
    console.error("❌ Minting error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


