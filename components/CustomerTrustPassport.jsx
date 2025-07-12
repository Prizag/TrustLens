'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import TrustLensABI from '@/lib/TrustLensABI.json';
import { Button } from '@/components/ui/button';
import { Loader2, Fingerprint } from 'lucide-react';

// This component takes a customer's wallet address as a prop
export default function CustomerTrustPassport({ customerWalletAddress }) {
    const [attestations, setAttestations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCustomerAttestations = async () => {
        if (!customerWalletAddress) {
            setError("This customer does not have a wallet address linked.");
            return;
        }

        setIsLoading(true);
        setError('');
        setAttestations([]);

        try {
            // We use a public, read-only provider. No wallet connection needed.
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                TrustLensABI,
                provider
            );

            const data = await contract.getAttestations(customerWalletAddress);
            const formatted = data.map(att => ({
                actionType: att.actionType,
                timestamp: new Date(Number(att.timestamp) * 1000).toLocaleString(),
            }));
            setAttestations(formatted);

        } catch (err) {
            console.error(err);
            setError("Failed to fetch on-chain data for this customer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg mt-4">
            <h4 className="font-semibold mb-2">Customer's Trust Passport</h4>
            <Button onClick={fetchCustomerAttestations} disabled={isLoading || !customerWalletAddress}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
                Fetch On-Chain History
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <ul className="mt-4 space-y-2">
                {attestations.map((att, index) => (
                    <li key={index} className="p-2 bg-green-100 text-green-800 text-sm rounded-md">
                        ✅ {att.actionType.replace(/_/g, ' ')} on {att.timestamp}
                    </li>
                ))}
            </ul>
        </div>
    );
}