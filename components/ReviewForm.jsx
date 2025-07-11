'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function SubmitReviewForm({ sellerId, customerId }) {
    const [reviewText, setReviewText] = useState('');
    const [userAddress, setUserAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const connectWallet = async () => {
        if (!window.ethereum) return alert("MetaMask is required.");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setUserAddress(accounts[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        // Send the review text AND the user's wallet address to your backend
        const response = await fetch('/api/review', { // Assuming you have an API route to save reviews
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: reviewText,
                sellerId: sellerId,
                customerId: customerId,
                userAddress: userAddress // <-- THE CRITICAL PIECE OF DATA
            }),
        });
        
        setIsLoading(false);
        if (response.ok) {
            setMessage("Thank you! Your review has been submitted.");
            setReviewText('');
        } else {
            setMessage("Failed to submit review.");
        }
    };

    return (
        <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold">Write a Review</h3>
            
            {!userAddress ? (
                <button onClick={connectWallet} className="my-4 px-4 py-2 bg-blue-600 text-white rounded">
                    Connect Wallet to Submit
                </button>
            ) : (
                <p className="my-4 p-2 bg-green-100 text-sm rounded">Wallet Connected: {userAddress}</p>
            )}

            <form onSubmit={handleSubmit}>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Share your thoughts..."
                    required
                />
                <button type="submit" disabled={!userAddress || isLoading} className="mt-4 px-4 py-2 bg-black text-white rounded disabled:bg-gray-400">
                    {isLoading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}