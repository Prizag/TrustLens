// app/api/attest/route.js

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { db } from '@/lib/prisma';
import TrustLensABI from '@/lib/TrustLensABI.json';

export async function POST(request) {
    const { reviewId } = await request.json();

    if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    try {
        const review = await db.review.findUnique({ where: { id: reviewId } });

        // Security checks
        if (!review || review.isAttested || !review.userAddress) {
            let reason = review ? "Already attested or no user address." : "Review not found.";
            return NextResponse.json({ message: `Attestation skipped: ${reason}` });
        }

        // Setup Ethers connection
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            TrustLensABI,
            signer
        );

        // Call the smart contract
        const transaction = await contract.addAttestation(review.userAddress, "positive_review");
        await transaction.wait();

        // Update database to prevent duplicates
        await db.review.update({
            where: { id: reviewId },
            data: { isAttested: true },
        });

        return NextResponse.json({
            message: "Attestation successful!",
            transactionHash: transaction.hash
        });

    } catch (error) {
        console.error("API Error during attestation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}