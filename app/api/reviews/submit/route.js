import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server'; // Assuming you use Clerk for seller auth

export async function POST(request) {
    const { comment, userAddress, customerId, sellerId } = await request.json();

    // Basic validation
    if (!comment || !userAddress) {
        return NextResponse.json({ error: 'Comment and userAddress are required.' }, { status: 400 });
    }

    try {
        // In a real application, you would get sellerId and customerId from your session or request body.
        // For this demo, we'll hardcode placeholders if they are not provided.
        const finalCustomerId = customerId || 'demo-customer-id';
        const finalSellerId = sellerId || 'demo-seller-id'; // Replace with a real seller ID from your DB for testing.

        const newReview = await db.review.create({
            data: {
                comment: comment,
                userAddress: userAddress, // Saving the user's wallet address!
                customerId: finalCustomerId,
                sellerId: finalSellerId,
                // The `isAttested` field will automatically default to `false`
            },
        });

        return NextResponse.json({ message: 'Review submitted successfully.', review: newReview });

    } catch (error) {
        console.error("Failed to save review:", error);
        return NextResponse.json({ error: 'Could not save review.' }, { status: 500 });
    }
}