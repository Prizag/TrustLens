import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  const { userId: clerkUserId } = getAuth(req);

  if (!clerkUserId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    // Step 1: find the seller from clerkUserId
    const seller = await db.seller.findUnique({
      where: { clerkUserId },
    });

    if (!seller) {
      return new Response(
        JSON.stringify({ error: "Seller not found" }),
        { status: 404 }
      );
    }

    // Step 2: find customers linked to seller.id
    const customers = await db.customer.findMany({
      where: { sellerId: seller.id },
      // optional: include related activity if you have that relation
    });

    return new Response(
      JSON.stringify(customers),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch customers" }),
      { status: 500 }
    );
  }
}
