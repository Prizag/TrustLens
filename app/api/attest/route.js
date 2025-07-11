import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { db } from '@/lib/prisma'; // Make sure you have your Prisma client configured here
import TrustLensABI from '@/lib/TrustLensABI.json';

// This updated POST function is more secure and integrated.
export async function POST(request) {
    // 1. We now expect a `reviewId` from the calling service (your dashboard page).
    const { reviewId } = await request.json();

    if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    try {
        // 2. Find the review in your database using Prisma.
        const review = await db.review.findUnique({
            where: { id: reviewId },
        });

        // 3. Perform server-side validation checks.
        if (!review) {
            return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
        }
        if (review.isAttested) {
            // This prevents duplicate transactions, saving gas fees.
            return NextResponse.json({ message: 'This review has already been attested on-chain.' });
        }
        if (!review.userAddress) {
            return NextResponse.json({ error: 'Review does not have an associated wallet address to attest.' }, { status: 400 });
        }
        
        // --- All checks passed, we can now proceed to the blockchain ---

        // 4. Set up the Ethers.js connection (this part is the same).
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            TrustLensABI,
            signer
        );

        // 5. Call the smart contract using data FROM YOUR DATABASE, not from the request.
        console.log(`Attesting action "positive_review" for user ${review.userAddress}...`);
        const transaction = await contract.addAttestation(review.userAddress, "positive_review");
        await transaction.wait();

        // 6. CRITICAL: Update your database to mark this review as attested.
        await db.review.update({
            where: { id: reviewId },
            data: { isAttested: true },
        });

        console.log(`Attestation successful! Tx Hash: ${transaction.hash}`);

        // 7. Send a full success response back.
        return NextResponse.json({
            message: "Attestation successful and database updated!",
            transactionHash: transaction.hash
        });

    } catch (error) {
        console.error("API Error during attestation:", error);
        // Provide a more detailed error for debugging if possible
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}