'use client';

import { useMemo, useState } from 'react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  // 👇 THIS IS THE LINE YOU WERE LOOKING FOR
  // Replace the address below with YOUR Devnet wallet address
  const recipient = useMemo(
    () => new PublicKey('Bmayq1wQF7vytQ2b6c6Db4zevDfBamA2mtKuZ8LLdGbw'),
    []
  );

  const [amount, setAmount] = useState('0.01');
  const [status, setStatus] = useState('');
  const [signature, setSignature] = useState('');

  async function sendSupport() {
    try {
      setStatus('Preparing transaction...');
      setSignature('');

      if (!publicKey) throw new Error('Wallet not connected');

      const sol = Number(amount);
      if (!Number.isFinite(sol) || sol <= 0) {
        throw new Error('Invalid SOL amount');
      }

      const lamports = Math.round(sol * LAMPORTS_PER_SOL);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      setStatus('Approve transaction in wallet...');
      const sig = await sendTransaction(tx, connection);
      setSignature(sig);

      setStatus('Confirming on devnet...');
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature: sig, ...latestBlockhash },
        'confirmed'
      );

      setStatus('✅ Sent and confirmed');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ ${err.message ?? 'Transaction failed'}`);
    }
  }

  return (
    <main style={{ padding: '40px', maxWidth: 700 }}>
      <h1>BlessBit</h1>
      <p>Non-custodial support for Solana creators and DAOs.</p>

      <div style={{ marginTop: 20 }}>
        <WalletMultiButton />
      </div>

      <hr style={{ margin: '30px 0' }} />

      <h2>Send Support (Devnet)</h2>

      <label>
        Amount (SOL)
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            display: 'block',
            marginTop: 8,
            padding: 8,
            width: 160,
            background: 'transparent',
            color: 'inherit',
            border: '1px solid #444',
            borderRadius: 6,
          }}
        />
      </label>

      <button
        onClick={sendSupport}
        disabled={!connected}
        style={{
          marginTop: 16,
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #444',
          background: connected ? 'transparent' : '#222',
          color: 'inherit',
          cursor: connected ? 'pointer' : 'not-allowed',
        }}
      >
        Send Support
      </button>

      <div style={{ marginTop: 16 }}>
        <div><strong>Status:</strong> {status || '—'}</div>

        {signature && (
          <div style={{ marginTop: 10 }}>
            <strong>Transaction Signature:</strong>
            <div style={{ wordBreak: 'break-all' }}>{signature}</div>
          </div>
        )}
      </div>
    </main>
  );
}
