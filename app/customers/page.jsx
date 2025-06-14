"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, AlertCircle, CheckCircle, MapPin, Calendar, ShoppingBag, Star, Users } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// Sample customer data
const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    location: "New York, USA",
    joinDate: "2022-03-15",
    trustScore: 92,
    status: "trusted",
    activity: [
      { date: "Jan", purchases: 3, reviews: 2, returns: 0 },
      { date: "Feb", purchases: 2, reviews: 1, returns: 0 },
      { date: "Mar", purchases: 4, reviews: 3, returns: 1 },
      { date: "Apr", purchases: 1, reviews: 1, returns: 0 },
      { date: "May", purchases: 2, reviews: 2, returns: 0 },
      { date: "Jun", purchases: 3, reviews: 2, returns: 0 },
    ],
    flags: [],
  },
  {
    id: 2,
    name: "Emma Johnson",
    email: "emma.j@example.com",
    location: "London, UK",
    joinDate: "2022-05-22",
    trustScore: 88,
    status: "trusted",
    activity: [
      { date: "Jan", purchases: 1, reviews: 1, returns: 0 },
      { date: "Feb", purchases: 2, reviews: 2, returns: 0 },
      { date: "Mar", purchases: 0, reviews: 0, returns: 0 },
      { date: "Apr", purchases: 3, reviews: 2, returns: 1 },
      { date: "May", purchases: 1, reviews: 1, returns: 0 },
      { date: "Jun", purchases: 2, reviews: 2, returns: 0 },
    ],
    flags: [],
  },
  {
    id: 3,
    name: "User123456",
    email: "user123456@mail.com",
    location: "Unknown",
    joinDate: "2023-05-30",
    trustScore: 35,
    status: "suspicious",
    activity: [
      { date: "Jan", purchases: 0, reviews: 0, returns: 0 },
      { date: "Feb", purchases: 0, reviews: 0, returns: 0 },
      { date: "Mar", purchases: 0, reviews: 0, returns: 0 },
      { date: "Apr", purchases: 0, reviews: 0, returns: 0 },
      { date: "May", purchases: 5, reviews: 12, returns: 4 },
      { date: "Jun", purchases: 8, reviews: 15, returns: 7 },
    ],
    flags: ["New account", "High review-to-purchase ratio", "Multiple returns"],
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    location: "Toronto, Canada",
    joinDate: "2021-11-08",
    trustScore: 95,
    status: "trusted",
    activity: [
      { date: "Jan", purchases: 2, reviews: 1, returns: 0 },
      { date: "Feb", purchases: 1, reviews: 1, returns: 0 },
      { date: "Mar", purchases: 3, reviews: 2, returns: 0 },
      { date: "Apr", purchases: 2, reviews: 1, returns: 0 },
      { date: "May", purchases: 1, reviews: 1, returns: 0 },
      { date: "Jun", purchases: 2, reviews: 2, returns: 0 },
    ],
    flags: [],
  },
  {
    id: 5,
    name: "BuyerX2023",
    email: "buyerx@tempmail.com",
    location: "Multiple locations",
    joinDate: "2023-04-12",
    trustScore: 42,
    status: "suspicious",
    activity: [
      { date: "Jan", purchases: 0, reviews: 0, returns: 0 },
      { date: "Feb", purchases: 0, reviews: 0, returns: 0 },
      { date: "Mar", purchases: 0, reviews: 0, returns: 0 },
      { date: "Apr", purchases: 3, reviews: 8, returns: 2 },
      { date: "May", purchases: 4, reviews: 10, returns: 3 },
      { date: "Jun", purchases: 6, reviews: 14, returns: 5 },
    ],
    flags: ["Multiple IP addresses", "Suspicious login patterns", "High review count"],
  },
]

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    if (!selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0])
    }
  }, [selectedCustomer])

  const filteredCustomers = customers.filter((customer) => {
    if (activeTab === "all") return true
    return customer.status === activeTab
  })

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-none">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black ml-10">Customer Analysis</h1>
        <p className="text-muted-foreground text-sm md:text-base ml-10">
          Monitor customer behavior and detect suspicious patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Customer List */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black font-bold">Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col gap-4 mb-6">
                   <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-slate-100 p-1">
                <TabsTrigger value="all" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="authentic" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
                  Trusted
                </TabsTrigger>
                <TabsTrigger value="suspicious" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
                  Suspicious
                </TabsTrigger>
              </TabsList>

                  <div className="relative bg-white">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground bg-white" />
                    <Input placeholder="Search customers..." className="pl-8 text-sm bg-white border-slate-300" />
                  </div>
                </div>

                <TabsContent value="all" className="m-0 text-black">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <CustomerListItem
                        key={customer.id}
                        customer={customer}
                        isSelected={selectedCustomer?.id === customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trusted" className="m-0 text-black">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <CustomerListItem
                        key={customer.id}
                        customer={customer}
                        isSelected={selectedCustomer?.id === customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="suspicious" className="m-0 text-black">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <CustomerListItem
                        key={customer.id}
                        customer={customer}
                        isSelected={selectedCustomer?.id === customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black font-bold">Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <CustomerDetail customer={selectedCustomer} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Users className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Customer Selected</h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Select a customer from the list to view detailed information and activity patterns.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CustomerListItem({ customer, isSelected, onClick }) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? customer.status === "trusted"
            ? "bg-blue-100 border border-blue-200"
            : "bg-red-100 border border-red-200"
          : "hover:bg-white/70"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${customer.name.charAt(0)}`} />
          <AvatarFallback className="bg-blue-200 text-blue-700 text-sm">{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate text-sm">{customer.name}</p>
            <Badge variant={customer.status === "trusted" ? "outline" : "destructive"} className={`flex font-bold border-red-100 p-1 text-xs shrink-0 ${customer.status==="suspicious"?"bg-red-600 text-white":""}`}>
              {customer.status === "trusted" ? (
                <>
                  <CheckCircle className="h-2 w-2 mr-1 text-blue-600" /> Trusted
                </>
              ) : (
                <>
                  <AlertCircle className="h-2 w-2 mr-1" /> Suspicious
                </>
              )}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
        </div>
      </div>
    </div>
  )
}

function CustomerDetail({ customer }) {
  const [chartMounted, setChartMounted] = useState(false)

  useEffect(() => {
    setChartMounted(true)
  }, [])

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-sky-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Avatar className="h-12 w-12 md:h-16 md:w-16">
          <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${customer.name.charAt(0)}`} />
          <AvatarFallback className="text-lg md:text-2xl">{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-black">{customer.name}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{customer.email}</p>

          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center text-xs md:text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              {customer.location}
            </div>

            <div className="flex items-center text-xs md:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Joined {new Date(customer.joinDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="text-xl md:text-2xl font-bold mb-1">
            <span
              className={
                customer.trustScore >= 80
                  ? "trust-score-high"
                  : customer.trustScore >= 50
                    ? "trust-score-medium"
                    : "trust-score-low"
              }
            >
              {customer.trustScore}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Trust Score</p>
          <div className="w-20 md:w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(customer.trustScore)}`}
              style={{ width: `${customer.trustScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      {customer.flags.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2 flex items-center text-sm md:text-base">
            <AlertCircle className="h-4 w-4 mr-2" />
            Suspicious Activity Flags
          </h3>
          <div className="flex flex-wrap gap-2">
            {customer.flags.map((flag, index) => (
              <Badge key={index} variant="destructive" className="text-xs bg-red-600 border-red-600 p-1.5 font-bold">
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Activity Chart */}
      <div>
        <h3 className="font-medium mb-4 text-sm md:text-base text-black">Activity History</h3>
        <div className="h-[200px] md:h-[250px] w-full border rounded-lg bg-white p-2 md:p-4">
          {chartMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customer.activity} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={11} tickMargin={5} />
                <YAxis fontSize={11} tickMargin={5} width={30} />
                <Legend wrapperStyle={{ fontSize: "11px" }} iconSize={10} />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                  name="Purchases"
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                  name="Reviews"
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#ef4444"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                  name="Returns"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <span className="text-gray-500 text-sm">Loading chart...</span>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-black">
        <div className="p-3 md:p-4 bg-white/50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            <h4 className="font-medium text-sm md:text-base">Purchase Activity</h4>
          </div>
          <p className="text-xl md:text-2xl font-bold">
            {customer.activity.reduce((sum, item) => sum + item.purchases, 0)}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">Total purchases</p>
        </div>

        <div className="p-3 md:p-4 bg-white/50 rounded-lg border border-sky-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 md:h-5 md:w-5 text-sky-500" />
            <h4 className="font-medium text-sm md:text-base">Review Activity</h4>
          </div>
          <p className="text-xl md:text-2xl font-bold">
            {customer.activity.reduce((sum, item) => sum + item.reviews, 0)}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">Total reviews</p>
        </div>

        <div className="p-3 md:p-4 bg-white/50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
            <h4 className="font-medium text-sm md:text-base">Return Activity</h4>
          </div>
          <p className="text-xl md:text-2xl font-bold">
            {customer.activity.reduce((sum, item) => sum + item.returns, 0)}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">Total returns</p>
        </div>
      </div>
    </div>
  )
}
