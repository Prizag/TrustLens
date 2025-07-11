import { Star, Users, ShoppingBag, AlertCircle } from "lucide-react";
import { TrustScoreCard } from "@/components/dashboard/trust-score-card";
import { ReviewTrendChart } from "@/components/dashboard/review-trend-chart";
import { SuspiciousActivityChart } from "@/components/dashboard/suspicious-activity-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { checkSeller } from "../lib/checkUser";
import {db} from "../lib/prisma.js";

async function analyzeReviewIfNeeded(review) {
  if (review.response) {
    return JSON.parse(review.response);
  }

  const res = await fetch('https://bert-fake-review-api.onrender.com/predict', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: review.comment }),
  });

  const data = await res.json();

  // Save back to DB
  await db.review.update({
    where: { id: review.id },
    data: {
      response: JSON.stringify(data),
      updatedAt: new Date(),
    },
  });

  return data;
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

  const reviews = await db.review.findMany({
    where: { sellerId: seller.id },
  });

  let totalConfidence = 0;
  let genuineCount = 0;

  const analyzedReviews = await Promise.all(
    reviews.map(async (r) => {
      const result = await analyzeReviewIfNeeded(r);
      if (result.label === "genuine") genuineCount += 1;
      totalConfidence += result.confidence || 0;
      return result;
    })
  );

  const count = analyzedReviews.length || 1;

  const scores = {
    overall: Math.round(totalConfidence / count),
    reviewAuth: Math.round((genuineCount / count) * 100),
    customerTrust: Math.min(100, Math.round((genuineCount / count) * 110)),
    productTrust: Math.max(50, Math.round(totalConfidence / count)),
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
        <TrustScoreCard title="Customer Trust" score={scores.customerTrust} icon={<Users />} />
        <TrustScoreCard title="Product Trust" score={scores.productTrust} icon={<ShoppingBag />} />
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
