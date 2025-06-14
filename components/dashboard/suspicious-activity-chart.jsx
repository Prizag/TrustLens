"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useState, useEffect } from "react"

const data = [
  { category: "Fake Reviews", count: 65, short: "Fake" },
  { category: "Bot Accounts", count: 42, short: "Bots" },
  { category: "Login Anomalies", count: 28, short: "Login" },
  { category: "Return Fraud", count: 15, short: "Returns" },
  { category: "Rating Manipulation", count: 37, short: "Rating" },
]

export function SuspiciousActivityChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="gradient-card w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Suspicious Activity Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading chart...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card w-full text-black">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Suspicious Activity Types</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="short" fontSize={11} tickMargin={5} interval={0} />
              <YAxis fontSize={12} tickMargin={5} width={40} />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[2, 2, 0, 0]} name="Activity Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
