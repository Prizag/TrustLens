'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button'; // Using your existing button component
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a textarea component
import { Wallet, Send, Loader2, CheckCircle } from 'lucide-react';

export default function ReviewForm() {
    const [reviewText, setReviewText] = useState('');
    const [userAddress, setUserAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError("MetaMask is required to submit a review.");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setUserAddress(accounts[0]);
            setError('');
        } catch (err) {
            setError("Failed to connect wallet.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // This fetch call sends the review to your backend to be saved.
            const response = await fetch('/api/reviews/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    comment: reviewText,
                    userAddress: userAddress,
                    // In a real app, you would also send customerId and sellerId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit review.");
            }

            setSuccessMessage("Thank you! Your review has been submitted for analysis.");
            setReviewText('');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
            <p className="text-sm text-gray-500 mb-6">Connect your wallet and submit a genuine review to earn a TrustLens attestation.</p>

            {!userAddress ? (
                <Button onClick={connectWallet} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Wallet to Begin
                </Button>
            ) : (
                <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
                    <strong>Connected:</strong> <span className="font-mono truncate">{userAddress}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on the product or service..."
                    className="min-h-[120px]"
                    required
                />
                <Button type="submit" disabled={!userAddress || isLoading} className="mt-4 w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isLoading ? "Submitting..." : "Submit Review"}
                </Button>
            </form>

            {successMessage && (
                <div className="mt-4 flex items-center p-3 text-sm text-green-800 bg-green-100 rounded-lg">
                    <CheckCircle className="mr-2 h-5 w-5" /> {successMessage}
                </div>
            )}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
}