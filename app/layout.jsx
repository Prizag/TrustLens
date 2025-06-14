import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TrustLens | Fake Review Detection",
  description: "ML-powered dashboard for detecting fake reviews and suspicious activity",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-white">
              <div className="fixed top-0 left-0 h-screen w-64 z-50">
    <DashboardSidebar />
  </div>
             <main className="ml-64 flex-1 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 overflow-x-hidden">
    {children}
  </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
