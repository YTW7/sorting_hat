// const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN; // Case-sensitive
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'app', 'db.json');
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN; 

type WalletEntry = { address: string };
type WalletDB = { wallets: WalletEntry[] };

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { wallet, sender } = body;

    if (!wallet || !sender) {
      return NextResponse.json({ message: 'Missing wallet or sender' }, { status: 400 });
    }

    if (sender !== ADMIN_WALLET) {
      return NextResponse.json({ message: 'Unauthorized: Not admin' }, { status: 403 });
    }

    // 1. Read existing file or create initial structure
    let data: WalletDB = { wallets: [] };

    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      try {
        data = JSON.parse(raw);
      } catch (err) {
        // corrupted JSON or empty file
        console.error('Error parsing db.json:', err);
        return NextResponse.json({ message: 'Invalid db.json format' }, { status: 500 });
      }
    }

    // 2. Check for duplicates (case-sensitive match)
    const alreadyExists = data.wallets.some(entry => entry.address === wallet);
    if (alreadyExists) {
      return NextResponse.json({ message: 'Wallet already exists' }, { status: 200 });
    }

    // 3. Add new wallet
    data.wallets.push({ address: wallet });
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: 'Wallet added successfully' }, { status: 200 });

  } catch (err) {
    console.error('Error in POST /api/add-wallet:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
