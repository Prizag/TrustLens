"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Bell, Clock, Filter, Star, User, ShoppingBag, CheckCircle, X } from "lucide-react"

// Sample alerts data
const alerts = [
  {
    id: 1,
    title: "Suspicious Review Cluster Detected",
    description: "Multiple 5-star reviews from similar IP addresses for Product #A1245",
    severity: "high",
    time: "10 minutes ago",
    type: "review",
    isRead: false,
  },
  {
    id: 2,
    title: "Unusual Login Pattern",
    description: "User ID #45678 logged in from 3 different countries in 24 hours",
    severity: "medium",
    time: "2 hours ago",
    type: "user",
    isRead: false,
  },
  {
    id: 3,
    title: "Potential Review Bot",
    description: "Account #89012 posted 15 reviews in 30 minutes",
    severity: "high",
    time: "5 hours ago",
    type: "review",
    isRead: true,
  },
  {
    id: 4,
    title: "Unusual Purchase Pattern",
    description: "Customer #34567 made multiple purchases and returns of the same item",
    severity: "medium",
    time: "1 day ago",
    type: "purchase",
    isRead: true,
  },
  {
    id: 5,
    title: "Suspicious Account Creation",
    description: "Multiple accounts created from the same device in short succession",
    severity: "medium",
    time: "2 days ago",
    type: "user",
    isRead: true,
  },
  {
    id: 6,
    title: "Review Content Similarity",
    description: "Product #B7890 received multiple reviews with nearly identical wording",
    severity: "high",
    time: "2 days ago",
    type: "review",
    isRead: false,
  },
  {
    id: 7,
    title: "Unusual Rating Distribution",
    description: "Product #C4567 received 50 5-star ratings in 1 hour after months of average ratings",
    severity: "high",
    time: "3 days ago",
    type: "review",
    isRead: true,
  },
]

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [readAlerts, setReadAlerts] = useState(alerts.filter((alert) => alert.isRead).map((alert) => alert.id))

  const markAsRead = (id) => {
    if (!readAlerts.includes(id)) {
      setReadAlerts([...readAlerts, id])
    }
  }

  const markAsUnread = (id) => {
    setReadAlerts(readAlerts.filter((alertId) => alertId !== id))
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !readAlerts.includes(alert.id)
    return alert.type === activeTab
  })

  const getAlertIcon = (type) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "purchase":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-none">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Alert Center</h1>
        <p className="text-muted-foreground text-sm md:text-base">Monitor and manage suspicious activity alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Alert Settings */}
        <div className="lg:col-span-4">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black font-bold">Alert Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-black">
                <h3 className="text-sm font-medium">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="email-alerts" className="text-sm">
                        Email Alerts
                      </Label>
                    </div>
                    <Switch id="email-alerts" defaultChecked/>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="push-alerts" className="text-sm">
                        Push Notifications
                      </Label>
                    </div>
                    <Switch id="push-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="sms-alerts" className="text-sm">
                        SMS Alerts
                      </Label>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-black">
                <h3 className="text-sm font-medium">Alert Thresholds</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <Label htmlFor="high-severity" className="text-sm">
                        High Severity
                      </Label>
                    </div>
                    <Switch id="high-severity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <Label htmlFor="medium-severity" className="text-sm">
                        Medium Severity
                      </Label>
                    </div>
                    <Switch id="medium-severity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="low-severity" className="text-sm">
                        Low Severity
                      </Label>
                    </div>
                    <Switch id="low-severity" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <div className="lg:col-span-8">
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl text-black">Alert Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <TabsList className="grid w-full sm:w-auto grid-cols-4 text-black bg-slate-100">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-2">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-2">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="review" className="text-xs data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-2">
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="user" className="text-xs data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-2">
                      Users
                    </TabsTrigger>
                  </TabsList>

                  <Button variant="outline" size="sm" className="gap-2 bg-white text-black border-slate-200">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="text-xs">Filter</span>
                  </Button>
                </div>

                <TabsContent value={activeTab} className="m-0">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border text-black ${
                            readAlerts.includes(alert.id) ? "bg-white/50 border-blue-100" : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 rounded-full p-1.5 ${
                                alert.severity === "high"
                                  ? "bg-red-100 text-red-600"
                                  : alert.severity === "medium"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-medium text-sm">{alert.title}</h3>
                                  <Badge
                                    variant={
                                      alert.severity === "high"
                                        ? "destructive"
                                        : alert.severity === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="capitalize text-xs"
                                  >
                                    {alert.severity}
                                  </Badge>
                                  {!readAlerts.includes(alert.id) && (
                                    <Badge variant="outline" className="bg-blue-100 text-black text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {alert.time}
                                  </span>
                                  {readAlerts.includes(alert.id) ? (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => markAsUnread(alert.id)}
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => markAsRead(alert.id)}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 p-3 mb-4">
                          <Bell className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                        <p className="text-muted-foreground max-w-md text-sm">
                          There are no alerts matching your current filter criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
