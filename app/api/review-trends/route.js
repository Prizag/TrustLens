import { db } from "@/lib/prisma"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

export const GET = async () => {
  const now = new Date()
  const months = []

  // Last 6 months + current
  for (let i = 6; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i))
    const monthEnd = endOfMonth(subMonths(now, i))
    const label = format(monthStart, "MMM")

    const authentic = await db.review.count({
      where: {
        createdAt: { gte: monthStart, lte: monthEnd },
        status: "authentic",
      },
    })

    const suspicious = await db.review.count({
      where: {
        createdAt: { gte: monthStart, lte: monthEnd },
        status: "suspicious",
      },
    })

    months.push({
      month: label,
      authentic,
      suspicious,
    })
  }

  return Response.json(months)
}
