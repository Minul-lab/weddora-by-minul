"use client"

import { useMemo, useState } from "react"
import {
  CalendarDays,
  Eye,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type AdminUser = {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  image?: string | null
  createdAt?: string | Date | null
  businessName?: string | null
  subscriptionPlan?: string | null
  isBlocked?: boolean | null
  banned?: boolean | null
  banReason?: string | null
  banExpires?: string | Date | null
}

type RoleFilter = "all" | "admin" | "customer" | "vendor"

const getUserIsBlocked = (user: AdminUser) =>
  user.isBlocked === true || user.banned === true

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not available"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function RoleBadge({ role }: { role?: string | null }) {
  const styleByRole: Record<string, string> = {
    admin: "bg-[#123D30] text-white",
    vendor: "bg-[#E8DCCB] text-[#6F5120]",
    customer: "bg-[#E8F0EB] text-[#315E45]",
  }
  const value = role || "unknown"

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${styleByRole[value] || "bg-[#F0EFEB] text-[#6B6B63]"}`}>
      {value}
    </span>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon
  label: string
  value: number
  detail: string
}) {
  return (
    <article className="rounded-2xl border border-[#E5DED2] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#6F8778]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#123D30]">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#A98542]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-xs text-[#8C918A]">{detail}</p>
    </article>
  )
}

export default function AdminUsersTable({
  users,
  total,
  error,
}: {
  users: AdminUser[]
  total: number
  error?: string
}) {
  const [searchText, setSearchText] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const blockedCount = users.filter(getUserIsBlocked).length
  const vendorCount = users.filter((user) => user.role === "vendor").length
  const customerCount = users.filter((user) => user.role === "customer").length

  const visibleUsers = useMemo(() => {
    const search = searchText.trim().toLowerCase()

    return users.filter((user) => {
      const name = user.name?.toLowerCase() || ""
      const email = user.email?.toLowerCase() || ""
      const matchesSearch = !search || name.includes(search) || email.includes(search)
      const matchesRole = roleFilter === "all" || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchText, roleFilter])

  return (
    <main className="min-h-full bg-[#FAF8F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#A98542] uppercase">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#123D30]">Manage Users</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F8778]">
              View registered Weddora accounts, search by name or email, and check each user&apos;s details.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5DED2] bg-white px-4 py-3 text-sm text-[#6F8778]">
            Total accounts <span className="ml-2 font-bold text-[#123D30]">{total}</span>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        <section aria-label="User overview" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={UsersRound} label="All users" value={total} detail="Registered accounts" />
          <SummaryCard icon={UserRound} label="Customers" value={customerCount} detail="Planning wedding events" />
          <SummaryCard icon={ShieldCheck} label="Vendors" value={vendorCount} detail="Offering wedding services" />
          <SummaryCard icon={ShieldAlert} label="Blocked" value={blockedCount} detail="Accounts currently blocked" />
        </section>

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#E5DED2] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#E5DED2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-semibold text-[#123D30]">Registered accounts</h2>
              <p className="mt-1 text-xs text-[#8C918A]">Block and Unblock controls are display-only for now.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block sm:w-72">
                <span className="sr-only">Search users by name or email</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8C918A]" aria-hidden="true" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search name or email"
                  className="h-10 w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F2] pr-3 pl-9 text-sm text-[#302D29] outline-none placeholder:text-[#9A9E97] focus:border-[#123D30] focus:ring-2 focus:ring-[#123D30]/10"
                />
              </label>
              <label>
                <span className="sr-only">Filter users by role</span>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
                  className="h-10 w-full rounded-xl border border-[#E5DED2] bg-white px-3 text-sm text-[#302D29] outline-none focus:border-[#123D30] sm:w-40"
                >
                  <option value="all">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-xs text-[#7C857D] sm:px-5">
            <span>Showing {visibleUsers.length} of {users.length} loaded users</span>
            {(searchText || roleFilter !== "all") && (
              <button
                type="button"
                onClick={() => { setSearchText(""); setRoleFilter("all") }}
                className="font-semibold text-[#123D30] underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>

          {error ? null : visibleUsers.length === 0 ? (
            <div className="border-t border-[#E5DED2] px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E5] text-[#123D30]">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-[#123D30]">No users found</h3>
              <p className="mt-1 text-sm text-[#6F8778]">Try a different name, email, or role filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-t border-[#E5DED2]">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[#FAF8F2] text-xs tracking-wide text-[#6F8778] uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">User</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Joined</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEAE0]">
                  {visibleUsers.map((user) => {
                    const blocked = getUserIsBlocked(user)

                    return (
                      <tr key={user.id} className="transition hover:bg-[#FCFBF8]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8DCCB] font-semibold text-[#123D30]">
                              {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#123D30]">{user.name || "Name not provided"}</p>
                              <p className="mt-0.5 truncate text-xs text-[#7C857D]">{user.email || "Email not provided"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                        <td className="px-5 py-4 text-[#6F8778]">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-2 text-xs font-semibold ${blocked ? "text-[#A4473B]" : "text-[#477454]"}`}>
                            <span className={`h-2 w-2 rounded-full ${blocked ? "bg-[#C65B4C]" : "bg-[#69A477]"}`} />
                            {blocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedUser(user)}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5DED2] px-3 text-xs font-semibold text-[#123D30] transition hover:bg-[#FAF8F2]"
                            >
                              <Eye className="h-4 w-4" aria-hidden="true" />
                              Details
                            </button>
                            <button
                              type="button"
                              disabled
                              title="User blocking is not connected yet"
                              className="inline-flex h-9 min-w-24 items-center justify-center rounded-lg bg-[#F0EFEB] px-3 text-xs font-semibold text-[#77776F] disabled:cursor-not-allowed disabled:opacity-80"
                            >
                              {blocked ? "Unblock" : "Block user"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Sheet open={Boolean(selectedUser)} onOpenChange={(open) => { if (!open) setSelectedUser(null) }}>
        <SheetContent className="w-full overflow-y-auto border-[#E5DED2] bg-[#FAF8F2] sm:max-w-md">
          {selectedUser && (
            <>
              <SheetHeader className="border-b border-[#E5DED2] px-5 pt-7 pb-5">
                <SheetTitle className="text-xl font-bold text-[#123D30]">User details</SheetTitle>
                <SheetDescription className="text-[#6F8778]">Account information for this registered user.</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-5 pb-7">
                <div className="flex items-center gap-4 rounded-2xl border border-[#E5DED2] bg-white p-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8DCCB] text-lg font-bold text-[#123D30]">
                    {(selectedUser.name || selectedUser.email || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-[#123D30]">{selectedUser.name || "Name not provided"}</h2>
                    <div className="mt-1"><RoleBadge role={selectedUser.role} /></div>
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border border-[#E5DED2] bg-white p-4 text-sm">
                  <p className="flex items-start gap-3 text-[#52665A]"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A15B]" /><span><span className="block text-xs text-[#8C918A]">Email</span>{selectedUser.email || "Not provided"}</span></p>
                  <p className="flex items-start gap-3 break-all text-[#52665A]"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A15B]" /><span><span className="block text-xs text-[#8C918A]">User ID</span>{selectedUser.id}</span></p>
                  <p className="flex items-start gap-3 text-[#52665A]"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A15B]" /><span><span className="block text-xs text-[#8C918A]">Joined</span>{formatDate(selectedUser.createdAt)}</span></p>
                </div>
                {selectedUser.role === "vendor" && (
                  <div className="space-y-3 rounded-2xl border border-[#E5DED2] bg-white p-4 text-sm">
                    <h3 className="font-semibold text-[#123D30]">Vendor information</h3>
                    <p className="text-[#52665A]"><span className="text-xs text-[#8C918A]">Business name</span><br />{selectedUser.businessName || "Not provided"}</p>
                    <p className="text-[#52665A]"><span className="text-xs text-[#8C918A]">Subscription plan</span><br />{selectedUser.subscriptionPlan || "Free"}</p>
                  </div>
                )}
                <div className="rounded-xl border border-[#E5DED2] bg-white px-4 py-3 text-sm">
                  <span className="text-[#8C918A]">Account status</span>
                  <p className={`mt-1 font-semibold ${getUserIsBlocked(selectedUser) ? "text-[#A4473B]" : "text-[#477454]"}`}>
                    {getUserIsBlocked(selectedUser) ? "Blocked" : "Active"}
                  </p>
                </div>
                <p className="text-xs leading-5 text-[#8C918A]">Block and Unblock are shown for the admin workflow, but aren&apos;t connected yet.</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  )
}
