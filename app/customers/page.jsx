"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search, AlertCircle, CheckCircle, MapPin, Calendar, ShoppingBag, Star, Users
} from "lucide-react"
import {
  Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch("/api/fetchCustomers")
        const data = await res.json()
        setCustomers(data)
        setSelectedCustomer(data[0] || null)
      } catch (err) {
        console.error("Failed to fetch customers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [])

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
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="trusted">Trusted</TabsTrigger>
                    <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
                  </TabsList>
                  <div className="relative bg-white">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

// 👉 shows trust score in list (optional)
function CustomerListItem({ customer, isSelected, onClick }) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={`/placeholder.svg?text=${customer.name.charAt(0)}`} />
          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <p className="font-medium truncate text-sm">{customer.name}</p>
            {customer.trustScore !== undefined && (
              <span className="text-xs text-muted-foreground">{customer.trustScore}/100</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
        </div>
      </div>
    </div>
  )
}

function CustomerDetail({ customer }) {
  const [trustScore, setTrustScore] = useState(customer.avgTrustScore || null)
  const [loadingScore, setLoadingScore] = useState(false)

  useEffect(() => {
    if (trustScore !== null) return // already loaded

    const fetchTrustScore = async () => {
      setLoadingScore(true)

      try {
        const res = await fetch("/api/transactionTrustScore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: customer.id, sellerId: customer.sellerId }),
        })

        const data = await res.json()
        console.log(data)
        if (data.avgTrustScore !== null) {
          setTrustScore(data.avgTrustScore)
        }
        else{
          setTrustScore(data.trustScore)
          console.log(data.trustScore)
        }
      } catch (err) {
        console.error("Failed to fetch trust score:", err)
      } finally {
        setLoadingScore(false)
      }
    }

    fetchTrustScore()
  }, [customer.id, customer.sellerId, trustScore])

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-sky-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Avatar className="h-12 w-12 md:h-16 md:w-16">
          <AvatarImage src={`/placeholder.svg?text=${customer.name.charAt(0)}`} />
          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-black">{customer.name}</h2>
          <p className="text-muted-foreground">{customer.email}</p>

          <div className="flex gap-3 mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {customer.address}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {new Date(customer.joinDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {loadingScore ? (
            <span className="text-sm text-gray-500">Calculating trust score...</span>
          ) : (
            <>
              <div className="text-xl font-bold text-black">
                {trustScore} <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Transaction Trust Score</p>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(trustScore)}`}
                  style={{ width: `${trustScore || 0}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}