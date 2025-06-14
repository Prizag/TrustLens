"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Star,
  Users,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => pathname === path

  return (
    <>
      {/* Hamburger Menu (Mobile Only) */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (mobile: slide-in | desktop: static) */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:block
        `}
      >
        <div className="flex flex-col h-full border-r border-blue-200">
          {/* Sidebar Header */}
          <SidebarHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold text-xl">
                TL
              </div>
              <div className="text-white font-bold text-xl">TrustLens</div>
            </div>
          </SidebarHeader>

          {/* Close Button (Mobile Only) */}
          <div className="sm:hidden flex justify-end px-4 py-2">
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Search */}
          <SidebarGroup className="px-4">
            <SidebarGroupContent className="relative">
              <SidebarInput
                placeholder="Search..."
                className="pl-8 bg-white border border-slate-300"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Navigation */}
          <SidebarContent className="flex-1 overflow-y-auto px-2 text-black">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
                    <Home className="text-blue-500" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reviews")}>
                  <Link href="/reviews">
                    <Star className="text-sky-500" />
                    <span>Reviews</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/customers")}>
                  <Link href="/customers">
                    <Users className="text-indigo-500" />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/alerts")}>
                  <Link href="/alerts">
                    <Bell className="text-red-500" />
                    <span>Alerts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link href="/settings">
                    <Settings className="text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="border-t border-blue-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-200 text-blue-700">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-black">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </div>
      </div>
    </>
  )
}
