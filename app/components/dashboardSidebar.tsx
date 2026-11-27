"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { authClient } from "@/lib/auth-client"

import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Users,
  FileCheck,
  ReceiptText,
} from "lucide-react"

import type { DashboardRole, MenuItem } from "@/types"


const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
  customer: [
    {
      id: "overview",
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      id: "my-bookings",
      name: "My Bookings",
      url: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    {
      id: "profile",
      name: "Profile Settings",
      url: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],

  vendor: [
    {
      id: "overview",
      name: "Overview",
      url: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      id: "my-services",
      name: "My Services",
      url: "/dashboard/vendor/my-services",
      icon: BriefcaseBusiness,
    },
    {
      id: "add-service",
      name: "Add Service",
      url: "/dashboard/vendor/my-services/new",
      icon: PlusCircle,
    },
    {
      id: "booking-requests",
      name: "Booking Requests",
      url: "/dashboard/vendor/bookings",
      icon: ClipboardList,
    },
    {
      id: "subscription",
      name: "Subscription",
      url: "/dashboard/vendor/subscription",
      icon: CreditCard,
    },
    {
      id: "profile",
      name: "Profile Settings",
      url: "/dashboard/vendor/profile",
      icon: UserRound,
    },
  ],

  admin: [
    {
      id: "overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "manage-users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "manage-services",
      name: "Manage Services",
      url: "/dashboard/admin/services",
      icon: FileCheck,
    },
    {
      id: "transactions",
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: ReceiptText,
    },
  ],
}

const DashboardSidebar = () => {
  const { data: session, isPending } = authClient.useSession()

  const userRole = session?.user?.role

  const role: DashboardRole =
    userRole === "vendor" || userRole === "admin" ? userRole : "customer"

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 py-3 text-xl font-bold">Weddora</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => {
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <Icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}

export default DashboardSidebar
