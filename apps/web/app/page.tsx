'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <main style={{ padding: '40px' }}>
      <h1>BlessBit</h1>
      <p>Non-custodial support for Solana creators and DAOs.</p>

      <div style={{ marginTop: '20px' }}>
        <WalletMultiButton />
      </div>
    </main>
  );
}
