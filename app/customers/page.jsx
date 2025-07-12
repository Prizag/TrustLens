"use client";

import { useState, useEffect } from "react";
// --- (Your other imports) ---
import CustomerTrustPassport from "@/components/CustomerTrustPassport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]); // Good: starts as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add state to track API errors

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/fetchCustomers");
        
        // --- FIX #1: Check if the response was successful ---
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch customers');
        }
        
        const data = await res.json();

        // --- FIX #2: Ensure the data is an array before setting it ---
        if (Array.isArray(data)) {
          setCustomers(data);
          // Set the first customer as selected if the list is not empty
          if (data.length > 0) {
            setSelectedCustomer(data[0]);
          }
        } else {
          // If the API returns something unexpected, log it and keep customers as an empty array.
          console.error("API did not return an array:", data);
          setCustomers([]);
        }

      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError(err.message); // Set the error message to display in the UI
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // This will now always work because `customers` is guaranteed to be an array.
  const filteredCustomers = customers.filter((customer) => {
    if (activeTab === "all") return true;
    if (activeTab === "trusted") return customer.avgTrustScore >= 80;
    if (activeTab === "suspicious") return customer.avgTrustScore < 50;
    return false;
  });

  // --- UI updated to handle loading and error states ---
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
                {/* ... your Tabs and Search ... */}
              </Tabs>
              {loading ? (
                <p className="text-center text-sm text-gray-500 py-4">Loading customers...</p>
              ) : error ? (
                <p className="text-center text-sm text-red-500 py-4">{error}</p>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                      <CustomerListItem
                        key={customer.id}
                        customer={customer}
                        isSelected={selectedCustomer?.id === customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                      />
                    )) : <p className="text-center text-sm text-gray-500 py-4">No customers found.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-8 xl:col-span-9">
          {/* ... your existing Customer Details component ... */}
        </div>
      </div>
    </div>
  );
}

// ... your CustomerListItem and CustomerDetail components ...