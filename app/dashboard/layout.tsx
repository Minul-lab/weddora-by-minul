"use client"

import { useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashBoardSidebar from "../components/dashboardSidebar"
import { Toaster } from "@/components/ui/toast"


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // The sidebar is fixed directly below the navbar, so its height has to be
  // available as a CSS variable. Keep it in sync with the real navbar height
  // (responsive logo, mobile menu opening, ...).
  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>("header")
    if (!navbar) return

    const syncNavbarHeight = () => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbar.offsetHeight}px`
      )
    }

    syncNavbarHeight()

    const observer = new ResizeObserver(syncNavbarHeight)
    observer.observe(navbar)

    return () => observer.disconnect()
  }, [])

  return (
    // Fill exactly the viewport minus the navbar, so the page itself never
    // overflows and no dark background shows through.
    <SidebarProvider className="h-[calc(100svh_-_var(--navbar-height))] min-h-0">
      <DashBoardSidebar />

      <SidebarInset className="overflow-y-auto bg-[#FAF8F2]">
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-[#E5DED2] bg-[#FAF8F2] px-4 py-2">
          <SidebarTrigger />
        </div>

        {children}
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout
