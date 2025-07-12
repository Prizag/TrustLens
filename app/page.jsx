import { Star, Users, ShoppingBag, AlertCircle, Fingerprint } from "lucide-react";
import { TrustScoreCard } from "@/components/dashboard/trust-score-card";
import { ReviewTrendChart } from "@/components/dashboard/review-trend-chart";
import { SuspiciousActivityChart } from "@/components/dashboard/suspicious-activity-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { checkSeller } from "../lib/checkUser";
import { db } from "../lib/prisma.js";

/**
 * This server-side function handles the analysis and on-chain attestation for a single review.
 * It's designed to be idempotent: it won't re-process or re-attest a review that's already done.
 * @param {object} review - The review object from the Prisma database.
 * @returns {Promise<object>} - An object containing the analysis result and attestation status.
 */
async function analyzeAndAttestReview(review) {
  // Efficiency Check: If the review is already processed and on-chain, return immediately.
  if (review.response && review.isAttested) {
    return { ...JSON.parse(review.response), isAttested: true };
  }

  // Step 1: Analyze the review with the ML API if it hasn't been analyzed before.
  const analysisResult = review.response ? JSON.parse(review.response) : await (async () => {
    console.log(`Analyzing review ${review.id} with ML model...`);
    const res = await fetch('https://bert-fake-review-api.onrender.com/predict', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: review.comment }),
    });
    const data = await res.json();
    // Save the ML response to the database to avoid re-analyzing in the future.
    await db.review.update({
      where: { id: review.id },
      data: { response: JSON.stringify(data), updatedAt: new Date() },
    });
    return data;
  })();

  let attestationSucceeded = review.isAttested;

  // Step 2: THE AUTOMATION TRIGGER for the blockchain.
  // This logic runs if the ML model deems the review "genuine", it hasn't been attested yet,
  // and a user wallet address is present.
  if (analysisResult.label === "genuine" && !review.isAttested && review.userAddress) {
    console.log(`✅ Review ${review.id} is genuine. Triggering on-chain attestation...`);
    try {
      // This fetch call securely triggers our backend API route.
      const attestResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We only send the review ID. The backend handles the rest securely.
        body: JSON.stringify({ reviewId: review.id }),
      });

      if (attestResponse.ok) {
        console.log(`🎉 Attestation successful for review ${review.id}`);
        // This is an "optimistic update". We assume the UI can show this as attested now.
        // The database is updated by the API route itself.
        attestationSucceeded = true;
      } else {
        const errorData = await attestResponse.json();
        console.error(`❌ Attestation API failed for review ${review.id}:`, errorData.error || 'Unknown API error');
      }
    } catch (error) {
      console.error("❌ Network error calling /api/attest:", error);
    }
  }

  return { ...analysisResult, isAttested: attestationSucceeded };
}

export default async function Home() {
  const seller = await checkSeller();

  if (!seller) {
    return (
      <div className="p-6 text-red-600">
        ❌ Error: Seller not found or not logged in.
      </div>
    );
  }

  // Fetch all of the seller's reviews from the database.
  const reviews = await db.review.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: 'desc' } // Process newest reviews first.
  });

  // Concurrently process all reviews. This is where the magic happens.
  // The `analyzeAndAttestReview` function is called for every review.
  const processedReviews = await Promise.all(
    reviews.map(r => analyzeAndAttestReview(r))
  );

  // --- Calculate statistics based on the processed results ---
  let totalConfidence = 0;
  let genuineCount = 0;
  let verifiedOnChainCount = 0; 

  for (const result of processedReviews) {
    if (result.label === "genuine") genuineCount += 1;
    if (result.isAttested) verifiedOnChainCount += 1;
    totalConfidence += result.confidence || 0;
  }
  
  const count = processedReviews.length || 1;

  const scores = {
    overall: Math.round(totalConfidence / count) || 0,
    reviewAuth: Math.round((genuineCount / count) * 100) || 0,
    customerTrust: Math.min(100, Math.round((genuineCount / count) * 110)) || 0,
  };

  // --- Render the final dashboard UI ---
  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-none">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r ml-10 from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TrustLens Dashboard
        </h1>
        <p className="text-muted-foreground text-sm md:text-base ml-10">
          Monitor and analyze reviews, customer behavior, and suspicious activities
        </p>
      </div>

      {/* Trust Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrustScoreCard title="Overall Trust Score" score={scores.overall} icon={<AlertCircle />} />
        <TrustScoreCard title="Review Authenticity" score={scores.reviewAuth} icon={<Star />} />
        <TrustScoreCard title="Verified on TrustLens" score={verifiedOnChainCount} isCount={true} icon={<Fingerprint />} />
        <TrustScoreCard title="Customer Trust" score={scores.customerTrust} icon={<Users />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full min-w-0">
          <ReviewTrendChart />
        </div>
        <div className="w-full min-w-0">
          <SuspiciousActivityChart />
        </div>
      </div>

      <div className="w-full">
        <RecentAlerts />
      </div>
    </div>
  );
}