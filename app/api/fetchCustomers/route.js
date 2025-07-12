import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(req) {
  // 1. Authenticate the request to identify the logged-in seller.
  // This is the secure pattern from your first code block.
  const { userId: clerkUserId } = getAuth(req);

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Find the seller's internal ID from their Clerk ID.
    const seller = await db.seller.findUnique({
      where: { clerkUserId },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller profile not found in database." }, { status: 404 });
    }

    // 3. Find all customers linked to this specific seller's ID.
    // We will now add the `select` statement to ensure we get all the fields we need.
    const customers = await db.customer.findMany({
      where: { 
        sellerId: seller.id 
      },
      // --- UPDATE APPLIED HERE ---
      // This `select` block ensures we only fetch the necessary data and explicitly
      // include the `walletAddress` needed for the TrustLens component.
      select: {
        id: true,
        name: true,
        email: true,
        avgTrustScore: true, // Assuming this is calculated elsewhere or stored
        address: true,
        createdAt: true,
        walletAddress: true, // This is critical for the TrustPassport feature
        // Include sellerId if you need it on the frontend, otherwise it can be omitted.
        sellerId: true, 
      }
    });

    // 4. Return the found customers using NextResponse for consistency.
    return NextResponse.json(customers);

  } catch (err) {
    console.error("API Error fetching customers:", err);
    return NextResponse.json({ error: "Failed to fetch customers due to a server error." }, { status: 500 });
  }
}