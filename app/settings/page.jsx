"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Bell, Moon, Sun, Laptop, Key, Save, CheckCircle, Sliders, Clock } from "lucide-react"
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
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px] bg-slate-200 text-black">
          <TabsTrigger value="account" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <User className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:p-1">
            <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
            Security
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
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black">Account Information</CardTitle>
              <CardDescription>Update your account details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <Input id="email" defaultValue={user.emailAddresses} className="bg-white border-slate-200" />
                </div>
                <div className="space-y-2  text-black">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" defaultValue="Product Manager" className="bg-white border-slate-200"/>
                </div>
                <div className="space-y-2 text-black">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue="Product" className="bg-white border-slate-200"/>
                </div>
                <div className="space-y-2 md:col-span-2  text-black">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-input bg-white border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Write a short bio about yourself"
                    defaultValue="Product Manager with 5+ years of experience in e-commerce and retail analytics."
                  />
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
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black">Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-black">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="bg-white border-slate-200" />
                  </div>
                  <div className="md:col-span-2 w-full h-px bg-border bg-slate-200" />
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="bg-white border-slate-200"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="bg-white border-slate-200" />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium text-black">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium">Login Sessions</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-blue-100 bg-white/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">Current Session</div>
                        <div className="text-xs text-muted-foreground mt-1">Windows 11 • Chrome • New York, USA</div>
                        <div className="flex items-center mt-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active now
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-blue-100 bg-white/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">Previous Session</div>
                        <div className="text-xs text-muted-foreground mt-1">macOS • Safari • Boston, USA</div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />2 days ago
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs h-7">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-black">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts">Suspicious Activity Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts about high-risk suspicious activities
                      </p>
                    </div>
                    <Switch id="email-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-reports">Weekly Summary Reports</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive weekly summary of trust metrics and activities
                      </p>
                    </div>
                    <Switch id="email-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-news">Product Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about new features and improvements
                      </p>
                    </div>
                    <Switch id="email-news" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-critical">Critical Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        High-priority alerts requiring immediate attention
                      </p>
                    </div>
                    <Switch id="push-critical" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-standard">Standard Alerts</Label>
                      <p className="text-xs text-muted-foreground">Regular notifications about suspicious activities</p>
                    </div>
                    <Switch id="push-standard" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium">Alert Thresholds</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="review-threshold">Review Alert Sensitivity</Label>
                      <span className="text-xs text-muted-foreground">Medium</span>
                    </div>
                    <Slider id="review-threshold" defaultValue={[50]} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="user-threshold">User Alert Sensitivity</Label>
                      <span className="text-xs text-muted-foreground">High</span>
                    </div>
                    <Slider id="user-threshold" defaultValue={[75]} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-black">Appearance Settings</CardTitle>
              <CardDescription>Customize how TrustLens looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-black">
                <h3 className="text-sm font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      theme === "light" ? "border-blue-500 bg-blue-50" : "border-border bg-white/50"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Sun className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      theme === "dark" ? "border-blue-500 bg-blue-50" : "border-border bg-white/50"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Moon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      theme === "system" ? "border-blue-500 bg-blue-50" : "border-border bg-white/50"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Laptop className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium">Dashboard Layout</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-xs text-muted-foreground">Display more information in a condensed layout</p>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-tooltips">Enhanced Tooltips</Label>
                      <p className="text-xs text-muted-foreground">Show detailed information in tooltips on hover</p>
                    </div>
                    <Switch id="show-tooltips" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-black">
                <h3 className="text-sm font-medium">Chart Preferences</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="chart-style">Chart Style</Label>
                    <Select defaultValue="modern">
                      <SelectTrigger id="chart-style" className="w-full bg-white border-slate-200">
                        <SelectValue placeholder="Select chart style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-density">Data Density</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="data-density" className="w-full bg-white border-slate-200">
                        <SelectValue placeholder="Select data density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
