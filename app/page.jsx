import { Star, Users, ShoppingBag, AlertCircle, Fingerprint } from "lucide-react";
import { TrustScoreCard } from "@/components/dashboard/trust-score-card";
import { ReviewTrendChart } from "@/components/dashboard/review-trend-chart";
import { SuspiciousActivityChart } from "@/components/dashboard/suspicious-activity-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { checkSeller } from "../lib/checkUser";
import { db } from "../lib/prisma.js";

async function analyzeReviewIfNeeded(review) {
  // Check if we've already analyzed and attested this review
  if (review.response && review.isAttested) {
    return { ...JSON.parse(review.response), isAttested: true };
  }

  // Analyze with ML API if needed
  const analysisResult = review.response ? JSON.parse(review.response) : await (async () => {
    const res = await fetch('https://bert-fake-review-api.onrender.com/predict', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: review.comment }),
    });
    const data = await res.json();
    await db.review.update({
      where: { id: review.id },
      data: { response: JSON.stringify(data), updatedAt: new Date() },
    });
    return data;
  })();

  let attestationSucceeded = review.isAttested;

  // --- THIS IS THE BLOCKCHAIN INTEGRATION LOGIC ---
  if (analysisResult.label === "genuine" && !review.isAttested && review.userAddress) {
    console.log(`Review ${review.id} is genuine. Attempting on-chain attestation...`);
    try {
      // --- UPDATE APPLIED HERE ---
      // We now call our new, more secure API endpoint, sending only the review ID.
      const attestResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id // Just send the review ID
        }),
      });

      // The logic below remains the same, but now it relies on the backend to have done its job.
      if (attestResponse.ok) {
        console.log(`Attestation successful for review ${review.id}`);
        // The backend now handles updating the database, so we can trust the process is complete.
        // For immediate UI feedback, we can assume success.
        attestationSucceeded = true;
      } else {
        // Log the error from the API for better debugging
        const errorData = await attestResponse.json();
        console.error(`Attestation failed for review ${review.id}:`, errorData.error);
      }
    } catch (error) {
      console.error("Error calling attest API:", error);
    }
  }

  // NOTE: This now optimistically returns `true` if the API call was okay.
  // For a more robust system, you might re-fetch the review from the DB here
  // to get the definitive `isAttested` status. For this app, this is fine.
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

  // Refetch reviews at the start to ensure we have the latest `isAttested` status
  const reviews = await db.review.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: 'desc' } // Process newest reviews first
  });

  let totalConfidence = 0;
  let genuineCount = 0;
  let verifiedOnChainCount = 0; 

  // We re-map the processing results here
  const processedReviews = await Promise.all(
    reviews.map(r => analyzeReviewIfNeeded(r))
  );

  // Calculate stats based on the results of the processing
  for (const result of processedReviews) {
    if (result.label === "genuine") genuineCount += 1;
    if (result.isAttested) verifiedOnChainCount += 1;
    totalConfidence += result.confidence || 0;
  }
  
  const count = processedReviews.length || 1;

  const scores = {
    overall: Math.round(totalConfidence / count),
    reviewAuth: Math.round((genuineCount / count) * 100),
    customerTrust: Math.min(100, Math.round((genuineCount / count) * 110)),
  };

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