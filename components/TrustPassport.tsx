'use client';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState } from 'react';
import { ethers } from 'ethers';
import TrustLensABI from '@/lib/TrustLensABI.json';

export default function TrustPassport() {
  const [account, setAccount] = useState<string | null>(null);
  const [attestations, setAttestations] = useState<{ actionType: string; timestamp: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<{
    chainId: number | null;
    networkName: string | null;
    codePresent: boolean | null;
  }>({
    chainId: null,
    networkName: null,
    codePresent: null,
  });

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('▶ Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local');
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("🔴 Please install MetaMask to use this feature.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // 1) Prompt MetaMask to switch/add Sepolia
      const SEPOLIA_CHAIN_ID = '0xAA36A7'; // decimal 11155111
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: SEPOLIA_CHAIN_ID }]);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Sepolia not added yet
          await provider.send('wallet_addEthereumChain', [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Test Network',
            rpcUrls: ['https://rpc.sepolia.org'],
            nativeCurrency: { name: 'SepoliaETH', symbol: 'SEP', decimals: 18 }
          }]);
          // retry the switch
          await provider.send('wallet_switchEthereumChain', [{ chainId: SEPOLIA_CHAIN_ID }]);
        } else {
          throw switchError;
        }
      }

      // 2) Log & store diagnostics
      const net = await provider.getNetwork();
      const code = await provider.getCode(contractAddress);
      setDiagnostics({
        chainId: Number(net.chainId),
        networkName: net.name,
        codePresent: code !== '0x',
      });
      console.log('🌐 Network:', net.chainId, net.name);
      console.log('💾 Contract bytecode present:', code !== '0x' ? '✅ yes' : '❌ no');

      // 3) Request wallet accounts
      const accounts: string[] = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setError('');
    } catch (err) {
      console.error(err);
      setError("🔴 Failed to connect wallet or switch network.");
    }
  };

  const fetchAttestations = async () => {
    if (!account) {
      setError("🔴 Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError('');
    setAttestations([]);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const contract = new ethers.Contract(contractAddress, TrustLensABI, provider);
      const data: any[] = await contract.getAttestations(account);

      const formatted = data.map(att => ({
        actionType: att.actionType as string,
        timestamp: new Date(Number(att.timestamp) * 1000).toLocaleString(),
      }));

      setAttestations(formatted);
    } catch (err) {
      console.error('Error during fetchAttestations:', err);
      setError("🔴 Failed to fetch on‑chain data. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 border rounded-lg shadow-sm bg-white text-black">
      <h3 className="text-xl font-bold mb-4">On‑Chain Reputation</h3>

      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Connect Wallet to View
        </button>
      ) : (
        <div>
          <div className="mb-4 p-2 bg-gray-100 rounded-md text-sm truncate">
            <strong>Connected:</strong> {account}
          </div>
          <button
            onClick={fetchAttestations}
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500"
          >
            {isLoading ? 'Loading History...' : 'Fetch My On‑Chain History'}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-red-600">{error}</p>}

      {/* Diagnostics */}
      {diagnostics.chainId !== null && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
          🔎 <strong>Diagnostics</strong>
          <div>Network: {diagnostics.chainId} ({diagnostics.networkName})</div>
          <div>
            Contract code at address:{' '}
            {diagnostics.codePresent ? '✅ Found' : '❌ Not Found'}
          </div>
        </div>
      )}

      {/* Attestations */}
      <div className="mt-4 space-y-2">
        {attestations.map((att, idx) => (
          <div
            key={idx}
            className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md"
          >
            <p>✅ <strong>{att.actionType.replace(/_/g, ' ')}</strong></p>
            <p className="text-xs text-gray-500">Verified on: {att.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}