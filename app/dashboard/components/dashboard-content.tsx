"use client"

import { useEffect, useState, type FormEvent, type SetStateAction } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  MapPin,
  UserRound,
} from "lucide-react"
import { updateApplicationStatus, type ApplicationDecision } from "@/lib/actions/application"
import type { LucideIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import {
  getApplicationsByUserId,
  getApplicationsByVendorId,
} from "@/lib/actions/application"
import { getServices } from "@/lib/api/services"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Application = {
  _id?: string | { $oid?: string }
  id?: string
  userId?: string | { $oid?: string }
  vendorId?: string | { $oid?: string }
  customerId?: string | { $oid?: string }
  serviceId?: string | { $oid?: string }
  service?: {
    category?: string
    location?: string
    price?: number
  }
  serviceName?: string
  vendorName?: string
  userName?: string
  customerName?: string
  userEmail?: string
  eventDate?: string
  eventLocation?: string
  message?: string
  status?: string
  createdAt?: string
}

type DashboardService = {
  vendorId?: string | { $oid?: string }
  status?: string
  approvalStatus?: string
  isAvailable?: boolean
  isActive?: boolean
}

type DashboardRole = "customer" | "vendor"

const idOf = (value: unknown) => {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "$oid" in value) {
    return String((value as { $oid?: string }).$oid ?? "")
  }
  return ""
}

const normalizeApplications = (value: unknown): Application[] => {
  if (Array.isArray(value)) return value as Application[]
  if (!value || typeof value !== "object") return []
  const data = value as { data?: unknown; applications?: unknown; bookings?: unknown }
  if (Array.isArray(data.data)) return data.data as Application[]
  if (Array.isArray(data.applications)) return data.applications as Application[]
  if (Array.isArray(data.bookings)) return data.bookings as Application[]
  return []
}

function useDashboardApplications(role: DashboardRole) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const userId = session?.user?.id ?? ""
  const [result, setResult] = useState<{
    userId: string
    applications: Application[]
    error: string
  } | null>(null)

  useEffect(() => {
    if (isSessionPending || !userId || session?.user?.role !== role) return

    let active = true

    const load = async () => {
      try {
        const response = role === "vendor"
          ? await getApplicationsByVendorId(userId)
          : await getApplicationsByUserId(userId)
        const matching = normalizeApplications(response).filter((application) => {
        const ownerId = role === "vendor"
          ? idOf(application.vendorId)
          : idOf(application.userId) || idOf(application.customerId)
          return ownerId === userId
        })
        if (active) setResult({ userId, applications: matching, error: "" })
      } catch {
        if (active) {
          setResult({
            userId,
            applications: [],
            error: "We couldn’t load your booking requests. Please try again later.",
          })
        }
      }
    }

    void load()
    return () => { active = false }
  }, [isSessionPending, role, session?.user?.role, userId])

  const isCurrentUser = result?.userId === userId
  const applications = isCurrentUser ? result.applications : []
  const setApplications = (update: SetStateAction<Application[]>) => {
    setResult((current) => {
      if (!current || current.userId !== userId) return current
      return {
        ...current,
        applications:
          typeof update === "function" ? update(current.applications) : update,
      }
    })
  }

  return {
    applications,
    setApplications,
    loading: isSessionPending || (Boolean(userId) && session?.user?.role === role && !isCurrentUser),
    error: isCurrentUser ? result.error : "",
    session,
  }
}

function StatusPill({ status }: { status?: string }) {
  const normalized = (status || "pending").toLowerCase()
  const colors: Record<string, string> = {
    accepted: "bg-emerald-100 text-emerald-800",
    completed: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-stone-100 text-stone-600",
    pending: "bg-amber-100 text-amber-800",
  }
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${colors[normalized] || "bg-stone-100 text-stone-600"}`}>
      {normalized}
    </span>
  )
}

function ApplicationCard({
  application,
  role,
  isUpdating,
  onDecision,
}: {
  application: Application
  role: DashboardRole
  isUpdating: boolean
  onDecision: (application: Application, status: ApplicationDecision) => void
}) {
  const otherParty = role === "vendor"
    ? application.customerName || application.userName || application.userEmail || "Customer"
    : application.vendorName || "Your vendor"
  const date = application.eventDate
    ? new Date(`${application.eventDate.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Date not provided"

  return (
    <article className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#A98542] uppercase">{role === "vendor" ? "Booking request" : "My booking"}</p>
          <h2 className="mt-1 text-lg font-bold text-[#123D30]">{application.serviceName || "Wedding service"}</h2>
          <p className="mt-1 text-sm text-[#6F8778]">{role === "vendor" ? "Customer" : "Vendor"}: {otherParty}</p>
          {role === "vendor" && application.userEmail && (
            <a className="mt-1 block text-sm text-[#6F8778] underline decoration-[#C6A15B] underline-offset-2" href={`mailto:${application.userEmail}`}>
              {application.userEmail}
            </a>
          )}
        </div>
        <StatusPill status={application.status} />
      </div>
      <div className="mt-5 grid gap-3 border-t border-[#E5DED2] pt-4 text-sm text-[#4E5B52] sm:grid-cols-2">
        <p><span className="font-semibold text-[#123D30]">Service:</span> {application.serviceName || "Wedding service"}{application.service?.category ? ` · ${application.service.category}` : ""}</p>
        {application.service?.price !== undefined && <p><span className="font-semibold text-[#123D30]">Service price:</span> ${Number(application.service.price).toLocaleString("en-US")}</p>}
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#C6A15B]" />{date}</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#C6A15B]" /><span className="truncate">{application.eventLocation || "Location not provided"}</span></p>
        {application.service?.location && <p className="sm:col-span-2"><span className="font-semibold text-[#123D30]">Service location:</span> {application.service.location}</p>}
      </div>
      {application.message && <p className="mt-4 rounded-xl bg-[#FAF8F2] p-4 text-sm leading-6 text-[#6F8778]">“{application.message}”</p>}
      {application.createdAt && <p className="mt-3 text-xs text-[#8C918A]">Requested {new Date(application.createdAt).toLocaleDateString()}</p>}
      {role === "vendor" && (application.status || "pending").toLowerCase() === "pending" && (
        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#E5DED2] pt-4">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onDecision(application, "rejected")}
            className="inline-flex min-h-10 items-center rounded-xl border border-[#D8D0C2] px-4 text-sm font-semibold text-[#6F5147] transition hover:bg-[#FAF8F2] disabled:opacity-60"
          >
            {isUpdating ? "Saving…" : "Reject"}
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onDecision(application, "accepted")}
            className="inline-flex min-h-10 items-center rounded-xl bg-[#123D30] px-4 text-sm font-semibold text-white transition hover:bg-[#1C5140] disabled:opacity-60"
          >
            {isUpdating ? "Saving…" : "Accept"}
          </button>
        </div>
      )}
    </article>
  )
}

function ApplicationsPanel({ role }: { role: DashboardRole }) {
  const { applications, setApplications, loading, error, session } = useDashboardApplications(role)
  const [updatingId, setUpdatingId] = useState("")
  const heading = role === "vendor" ? "Booking Requests" : "My Bookings"

  const decideApplication = async (application: Application, status: ApplicationDecision) => {
    const applicationId = idOf(application._id) || application.id || ""
    if (!applicationId || (application.status || "pending").toLowerCase() !== "pending") return

    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, status)
      setApplications((current) => current.map((item) =>
        (idOf(item._id) || item.id) === applicationId ? { ...item, status } : item
      ))
      toast.add({
        type: "success",
        title: status === "accepted" ? "Request accepted" : "Request rejected",
        description: `The booking request for ${application.serviceName || "this service"} was ${status}.`,
      })
    } catch (decisionError) {
      toast.add({
        type: "error",
        title: "Could not update request",
        description: decisionError instanceof Error ? decisionError.message : "Please refresh and try again.",
      })
    } finally {
      setUpdatingId("")
    }
  }

  if (!loading && session?.user?.role !== role) {
    return <div className="rounded-2xl border border-[#E5DED2] bg-white p-8 text-center text-[#6F8778]">Sign in with a {role} account to view this page.</div>
  }

  return (
    <section>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-[#A98542] uppercase">{role === "vendor" ? "Your business" : "Your celebration"}</p>
          <h1 className="mt-2 text-3xl font-bold text-[#123D30]">{heading}</h1>
          <p className="mt-2 text-sm text-[#6F8778]">{role === "vendor" ? "Review the booking requests sent to your services." : "Keep track of the wedding services you’ve requested."}</p>
        </div>
        {!loading && <span className="rounded-full bg-[#E8DCCB] px-4 py-2 text-sm font-semibold text-[#123D30]">{applications.length} {applications.length === 1 ? "request" : "requests"}</span>}
      </div>
      {loading ? (
        <div className="grid gap-4" aria-label="Loading requests"><div className="h-40 animate-pulse rounded-2xl bg-white" /><div className="h-40 animate-pulse rounded-2xl bg-white" /></div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-center text-sm text-red-700">{error}</div>
      ) : applications.length ? (
        <div className="grid gap-4">{applications.map((application, index) => {
          const applicationId = idOf(application._id) || application.id || ""
          return <ApplicationCard key={applicationId || `${application.serviceId}-${index}`} application={application} role={role} isUpdating={updatingId === applicationId} onDecision={decideApplication} />
        })}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#D9CFBC] bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F0E5] text-[#123D30]"><ClipboardList className="h-6 w-6" /></span>
          <h2 className="mt-4 text-xl font-semibold text-[#123D30]">No {role === "vendor" ? "requests" : "bookings"} yet</h2>
          <p className="mt-2 text-sm text-[#6F8778]">{role === "vendor" ? "New booking requests for your services will appear here." : "Explore services and send a request when you find the right fit."}</p>
          {role === "customer" && <Link href="/browse-services" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#123D30] px-5 text-sm font-semibold text-white hover:bg-[#1C5140]">Browse services <ArrowRight className="h-4 w-4" /></Link>}
        </div>
      )}
    </section>
  )
}

export function CustomerBookingsPage() {
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><ApplicationsPanel role="customer" /></div></main>
}

export function VendorBookingsPage() {
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><ApplicationsPanel role="vendor" /></div></main>
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: number | string; detail: string }) {
  return <div className="rounded-2xl border border-[#E5DED2] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#A98542]"><Icon className="h-5 w-5" /></span><p className="mt-4 text-sm text-[#6F8778]">{label}</p><p className="mt-1 text-3xl font-bold text-[#123D30]">{value}</p><p className="mt-1 text-xs text-[#8C918A]">{detail}</p></div>
}

export function CustomerOverview() {
  const { applications, loading } = useDashboardApplications("customer")
  const pending = applications.filter((item) => (item.status || "pending").toLowerCase() === "pending").length
  const accepted = applications.filter((item) => (item.status || "").toLowerCase() === "accepted").length
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold tracking-[0.18em] text-[#A98542] uppercase">Customer dashboard</p><h1 className="mt-2 text-3xl font-bold text-[#123D30]">Welcome to your wedding plans</h1><p className="mt-2 text-[#6F8778]">Your requests and next steps, all in one place.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><MetricCard icon={ClipboardList} label="Total bookings" value={loading ? "—" : applications.length} detail="Requests you’ve sent" /><MetricCard icon={Clock3} label="Awaiting a response" value={loading ? "—" : pending} detail="Pending vendor replies" /><MetricCard icon={CheckCircle2} label="Accepted" value={loading ? "—" : accepted} detail="Confirmed by your vendors" /></div><div className="mt-8 rounded-2xl bg-[#123D30] p-6 text-white sm:p-8"><p className="text-sm font-semibold text-[#D6B771]">Make it yours</p><h2 className="mt-2 font-serif text-2xl">Find the people behind your perfect day.</h2><Link href="/browse-services" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C6A15B] px-5 text-sm font-bold text-[#123D30]">Explore services <ArrowRight className="h-4 w-4" /></Link></div></div></main>
}

export function VendorOverview() {
  const { applications, loading: applicationLoading, session } = useDashboardApplications("vendor")
  const [serviceCount, setServiceCount] = useState<number | null>(null)
  const [serviceError, setServiceError] = useState(false)
  const vendorId = session?.user?.id ?? ""
  useEffect(() => {
    if (!vendorId || session?.user?.role !== "vendor") return
    let active = true
    getServices().then((response) => {
      const rows = Array.isArray(response) ? response : response.data ?? response.services ?? []
      const own = (rows as DashboardService[]).filter((service) => idOf(service.vendorId) === vendorId)
      if (active) setServiceCount(own.length)
    }).catch(() => { if (active) setServiceError(true) })
    return () => { active = false }
  }, [session?.user?.role, vendorId])
  const pending = applications.filter((item) => (item.status || "pending").toLowerCase() === "pending").length
  const activeServices = serviceCount === null ? null : serviceCount
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold tracking-[0.18em] text-[#A98542] uppercase">Vendor dashboard</p><h1 className="mt-2 text-3xl font-bold text-[#123D30]">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}</h1><p className="mt-2 text-[#6F8778]">Here’s what’s happening with your wedding services.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><MetricCard icon={ClipboardList} label="Booking requests" value={applicationLoading ? "—" : applications.length} detail="All requests sent to you" /><MetricCard icon={Clock3} label="Needs your attention" value={applicationLoading ? "—" : pending} detail="Pending requests" /><MetricCard icon={CheckCircle2} label="Your services" value={serviceError ? "—" : activeServices ?? "—"} detail="Services linked to your account" /></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/dashboard/vendor/bookings" className="group rounded-2xl border border-[#E5DED2] bg-white p-6 transition hover:border-[#C6A15B] hover:shadow-md"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#A98542]"><CalendarDays className="h-5 w-5" /></span><h2 className="mt-4 font-semibold text-[#123D30]">Review booking requests</h2><p className="mt-1 text-sm text-[#6F8778]">See the event details customers sent with their request.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#123D30]">Open requests <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link><Link href="/dashboard/vendor/my-services" className="group rounded-2xl border border-[#E5DED2] bg-white p-6 transition hover:border-[#C6A15B] hover:shadow-md"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#A98542]"><UserRound className="h-5 w-5" /></span><h2 className="mt-4 font-semibold text-[#123D30]">Manage your services</h2><p className="mt-1 text-sm text-[#6F8778]">Keep your wedding service listings up to date.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#123D30]">View services <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link></div></div></main>
}

export function ProfileSettingsPage({ role }: { role: DashboardRole }) {
  const { data: session, isPending } = authClient.useSession()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!session?.user || session.user.role !== role) return
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const image = String(formData.get("image") ?? "").trim()
    setSaving(true)
    try {
      const result = await authClient.updateUser({ name: name.trim(), image: image.trim() || null })
      if (result.error) throw new Error(result.error.message || "Profile update failed")
      toast.add({ type: "success", title: "Profile updated", description: "Your profile details have been saved." })
    } catch (error) {
      toast.add({ type: "error", title: "Could not update profile", description: error instanceof Error ? error.message : "Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (isPending) return <main className="grid min-h-full place-items-center px-4 py-8 text-sm text-[#6F8778]">Loading profile…</main>
  if (session?.user?.role !== role) return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl rounded-2xl border border-[#E5DED2] bg-white p-8 text-center text-[#6F8778]">Sign in with a {role} account to update this profile.</div></main>
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold tracking-[0.18em] text-[#A98542] uppercase">Account</p><h1 className="mt-2 text-3xl font-bold text-[#123D30]">Profile Settings</h1><p className="mt-2 text-[#6F8778]">Update the details people see when they connect with you.</p><form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-2xl border border-[#E5DED2] bg-white p-5 sm:p-7"><div><label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-[#123D30]">Name</label><Input id="profile-name" name="name" required defaultValue={session.user.name ?? ""} className="h-11 rounded-xl border-[#E5DED2]" /></div><div><label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-[#123D30]">Email</label><Input id="profile-email" type="email" value={session.user.email ?? ""} disabled className="h-11 rounded-xl border-[#E5DED2] bg-[#FAF8F2]" /><p className="mt-1 text-xs text-[#8C918A]">Email address is managed by your sign-in account.</p></div><div><label htmlFor="profile-image" className="mb-2 block text-sm font-semibold text-[#123D30]">Profile image URL</label><Input id="profile-image" name="image" type="url" defaultValue={session.user.image ?? ""} placeholder="https://example.com/your-photo.jpg" className="h-11 rounded-xl border-[#E5DED2]" /></div><Button type="submit" disabled={saving} className="h-11 rounded-xl bg-[#123D30] px-5 text-white hover:bg-[#1C5140]">{saving ? "Saving…" : "Save profile"}</Button></form></div></main>
}
