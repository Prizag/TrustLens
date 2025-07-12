import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

// --- CHANGE 1: Define the fields you want to select ---
// This ensures we only request columns that actually exist in the database.
const sellerSelection = {
  id: true,
  clerkUserId: true,
  name: true,
  email: true,
  profileImage: true,
  // IMPORTANT: Do NOT include 'products' or other relation fields here.
  // Add any other existing scalar fields from your Seller model if needed.
};

export const checkSeller = async () => {
  const user = await currentUser();

  // Return early if there's no user or email
  if (!user || !user.emailAddresses?.[0]?.emailAddress) {
    return null;
  }
  
  const userEmail = user.emailAddresses[0].emailAddress;

  try {
    // 🔍 Look for an existing Seller by email
    const existingSeller = await db.seller.findUnique({
      where: {
        email: userEmail,
      },
      // --- CHANGE 2: Use the 'select' clause ---
      // This forces Prisma to only fetch the fields we specified.
      select: sellerSelection,
    });

    if (existingSeller) {
      return existingSeller;
    }

    // 🔷 Build Seller name safely
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed Seller";

    // 📝 Create a new Seller
    const newSeller = await db.seller.create({
      data: {
        clerkUserId: user.id,
        name,
        email: userEmail,
        // Removed password_hash as it's likely not needed when using Clerk for auth
        profileImage: user.imageUrl || "",
      },
      // --- CHANGE 3: Also use 'select' on create ---
      // This ensures the returned object has the same, safe shape.
      select: sellerSelection,
    });

    return newSeller;
  } catch (error) {
    console.error("A database error occurred in checkSeller:", error);
    return null;
  }
};