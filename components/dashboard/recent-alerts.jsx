import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, User, Star, ShoppingBag } from "lucide-react"

const alerts = [
  {
    id: 1,
    title: "Suspicious Review Cluster Detected",
    description: "Multiple 5-star reviews from similar IP addresses for Product #A1245",
    severity: "high",
    time: "10 minutes ago",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: 2,
    title: "Unusual Login Pattern",
    description: "User ID #45678 logged in from 3 different countries in 24 hours",
    severity: "medium",
    time: "2 hours ago",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 3,
    title: "Potential Review Bot",
    description: "Account #89012 posted 15 reviews in 30 minutes",
    severity: "high",
    time: "5 hours ago",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: 4,
    title: "Unusual Purchase Pattern",
    description: "Customer #34567 made multiple purchases and returns of the same item",
    severity: "medium",
    time: "1 day ago",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
]

export function RecentAlerts() {
  return (
    <Card className="gradient-card text-black">
      <CardHeader>
        <CardTitle className="text-blue-700">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg  border border-blue-100">
              <div
                className={`mt-0.5 rounded-full p-1.5 ${
                  alert.severity === "high"
                    ? "bg-red-100 text-red-600"
                    : alert.severity === "medium"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {alert.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{alert.title}</p>
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"
                    }
                    className={`capitalize border-slate-100 p-2 ${
                  alert.severity === "high"
                    ? "bg-red-600 text-white"
                    : alert.severity === "medium"
                      ? "bg-blue-600 text-white"
                      : "bg-yellow-600 text-white"
                } `}
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
