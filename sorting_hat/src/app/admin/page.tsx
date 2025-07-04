"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN; // Case-sensitive

export default function AdminPage() {
  const { publicKey, connected } = useWallet();
  const [walletToAdd, setWalletToAdd] = useState('');
  const [status, setStatus] = useState('');

  const userAddress = publicKey?.toBase58();

  const isAdmin = userAddress === ADMIN_WALLET;

  const handleAddWallet = async () => {
    if (!walletToAdd) {
      setStatus('Enter a wallet address.');
      return;
    }

    const res = await fetch('/api/add-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: walletToAdd, sender: userAddress }),
    });

    const data = await res.json();
    setStatus(data.message);
    setWalletToAdd('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Wallet Access</h2>
      <WalletMultiButton />
      {connected && (
        <>
          <p>Connected as: <code>{userAddress}</code></p>
          {isAdmin ? (
            <>
              <input
                type="text"
                placeholder="Wallet address to add"
                value={walletToAdd}
                onChange={(e) => setWalletToAdd(e.target.value)}
                style={{ padding: '0.5rem', marginRight: '1rem' }}
              />
              <button onClick={handleAddWallet}>Add Wallet</button>
              {status && <p>{status}</p>}
            </>
          ) : (
            <p style={{ color: 'red' }}>Access Denied: Not an admin wallet</p>
          )}
        </>
      )}
    </div>
  );
}
