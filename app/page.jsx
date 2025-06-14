import { Star, Users, ShoppingBag, AlertCircle } from "lucide-react"
import { TrustScoreCard } from "@/components/dashboard/trust-score-card"
import { ReviewTrendChart } from "@/components/dashboard/review-trend-chart"
import { SuspiciousActivityChart } from "@/components/dashboard/suspicious-activity-chart"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"

export default function Home() {
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

      {/* Trust Score Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrustScoreCard title="Overall Trust Score" score={78} icon={<AlertCircle />} />
        <TrustScoreCard title="Review Authenticity" score={82} icon={<Star />} />
        <TrustScoreCard title="Customer Trust" score={91} icon={<Users />} />
        <TrustScoreCard title="Product Trust" score={65} icon={<ShoppingBag />} />
      </div>

      {/* Charts - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full min-w-0">
          <ReviewTrendChart />
        </div>
        <div className="w-full min-w-0">
          <SuspiciousActivityChart />
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="w-full">
        <RecentAlerts />
      </div>
    </div>
  )
}
