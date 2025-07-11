"use client"

import { useState } from "react"
// --- (Step 1: Import your new component) ---
import TrustPassport from '@/components/TrustPassport'; 

// --- (Your existing imports) ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// --- (Step 2: Import a new icon for the Trust Passport tab) ---
import { User, Shield, Bell, Moon, Sun, Laptop, Key, Save, CheckCircle, Sliders, Clock, Fingerprint } from "lucide-react" 
import { useUser } from "@clerk/nextjs"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [theme, setTheme] = useState("system")
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) return <div>Loading...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-none">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black ml-10">Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base ml-10">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* --- (Step 3: Update the grid columns to accommodate the new tab) --- */}
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[750px] bg-slate-200 text-black">
          <TabsTrigger value="account" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <User className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Security
          </TabsTrigger>
          
          {/* --- (Step 4: Add the new "Trust Passport" tab trigger) --- */}
          <TabsTrigger value="trust-passport" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Trust Passport
          </TabsTrigger>

          <TabsTrigger value="notifications" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <Bell className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <Sliders className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          {/* ... Your existing Account content ... */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black">Account Information</CardTitle>
              <CardDescription>Update your account details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ... Content remains the same ... */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                   <img src={user.imageUrl} alt="Profile" width={80} />
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium text-black">Profile Picture</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-black bg-white border-slate-200">
                      Upload
                    </Button>
                    <Button variant="ghost" size="sm" className="text-black">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 text-black">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.fullName} className="bg-white border-slate-200" />
                </div>
                <div className="space-y-2 text-black">
                  <Label htmlFor="email">Email Address</Label>
                  {/* Note: Clerk's user object has emailAddresses as an array. You might want to display the primary one. */}
                  <Input id="email" defaultValue={user.emailAddresses[0]?.emailAddress} className="bg-white border-slate-200" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
            {/* ... Your existing Security content ... */}
        </TabsContent>

        {/* --- (Step 5: Add the new TabsContent for the Trust Passport) --- */}
        <TabsContent value="trust-passport" className="space-y-4">
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-black">Web3 Trust Passport</CardTitle>
                <CardDescription>View and manage your on-chain decentralized reputation.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Here we place your new component! */}
                <TrustPassport />
              </CardContent>
            </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
             {/* ... Your existing Notifications content ... */}
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
             {/* ... Your existing Appearance content ... */}
        </TabsContent>
      </Tabs>
    </div>
  )
}