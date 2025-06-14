import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TrustScoreCard({ title, score, icon }) {
  const getScoreColor = () => {
    if (score >= 80) return "trust-score-high"
    if (score >= 50) return "trust-score-medium"
    return "trust-score-low"
  }

  const getProgressColor = () => {
    if (score >= 80) return "bg-sky-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <Card className="gradient-card text-black">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          <span className={getScoreColor()}>{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
