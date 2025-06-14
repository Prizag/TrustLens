"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useState, useEffect } from "react"

const data = [
  { month: "Jan", authentic: 120, suspicious: 20 },
  { month: "Feb", authentic: 150, suspicious: 25 },
  { month: "Mar", authentic: 180, suspicious: 40 },
  { month: "Apr", authentic: 220, suspicious: 45 },
  { month: "May", authentic: 250, suspicious: 60 },
  { month: "Jun", authentic: 280, suspicious: 55 },
  { month: "Jul", authentic: 310, suspicious: 70 },
]

export function ReviewTrendChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="gradient-card w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Review Trends</CardTitle>
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
        <CardTitle className="text-lg md:text-xl">Review Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={12} tickMargin={5} />
              <YAxis fontSize={12} tickMargin={5} width={40} />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
              <Line
                type="monotone"
                dataKey="authentic"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 4 }}
                name="Authentic"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="suspicious"
                stroke="#ef4444"
                strokeWidth={2}
                activeDot={{ r: 4 }}
                name="Suspicious"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
