"use client"

import { Home, Star, Users, Bell, Settings, LogOut, Search } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <Sidebar className="border-r border-r-blue-200 bg-white min-h-full text-black fixed">
      <SidebarHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 font-bold text-xl">
            TL
          </div>
          <div className="text-white font-bold text-xl">TrustLens</div>
        </div>
      </SidebarHeader>

      <SidebarGroup className="py-2">
        <SidebarGroupContent className="relative">
          <SidebarInput placeholder="Search..." className="pl-8 bg-white border-slate-400" />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild isActive={isActive("/")}>
              <Link href="/">
                <Home className="text-blue-500" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild isActive={isActive("/reviews")}>
              <Link href="/reviews">
                <Star className="text-sky-500" />
                <span>Reviews</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild isActive={isActive("/customers")}>
              <Link href="/customers">
                <Users className="text-indigo-500" />
                <span>Customers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild isActive={isActive("/alerts")}>
              <Link href="/alerts">
                <Bell className="text-red-500" />
                <span>Alerts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <Link href="/settings">
                <Settings className="text-slate-500" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-t-blue-200 mt-[100%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="border-r-5">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-200 text-blue-700 ">JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
