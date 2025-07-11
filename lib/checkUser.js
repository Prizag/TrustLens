import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkSeller = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // 🔍 Look for an existing Seller by Clerk user ID
    const existingSeller = await db.seller.findUnique({
      where: {
        email:user.emailAddresses?.[0]?.emailAddress,
      },
    });

    if (existingSeller) {
      return existingSeller;
    }

    // 🔷 Build Seller name safely
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed";

    // 📝 Create a new Seller
    const newSeller = await db.seller.create({
      data: {
        clerkUserId: user.id,
        name,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        password_hash: "", // optional placeholder, Clerk handles auth
        profileImage: user.imageUrl || "",
        // optionally add trustScore, phone, etc. if you want
      },
    });

    return newSeller;
  } catch (error) {
    console.error("checkSeller error:", error);
    return null;
  }
};
