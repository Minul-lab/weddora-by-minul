import type { LucideIcon } from "lucide-react"

/**
 * Shared type declarations for the whole application.
 *
 * Import everything from `@/types` instead of declaring types next to the
 * components/helpers that happen to use them.
 */

/** MongoDB ObjectIds arrive either as strings or as extended-JSON objects. */
export type ObjectIdRef = string | { $oid: string }

export type IService = {
  _id: ObjectIdRef
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  image: string
  approvalStatus?: string
  isAvailable?: boolean
}

export type VendorSummary = {
  name?: string
  businessName?: string
  image?: string
  email?: string
}

export type ServiceDetail = IService & {
  images?: string[]
  status?: string
  isActive?: boolean
  vendorId?: ObjectIdRef
  vendorEmail?: string
  vendorName?: string
  businessName?: string
  vendor?: VendorSummary | null
}

export type BrowseService = IService & {
  images?: string[]
  status?: string
  isActive?: boolean
  vendorName?: string
  businessName?: string
  vendor?: VendorSummary | null
}

export type ServiceFilters = {
  search?: string
  category?: string
  location?: string
  vendorId?: string
}

export type ServicesResponse =
  | IService[]
  | { data?: IService[]; services?: IService[] }

export type CreateServicePayload = {
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  image: string
  vendorId: string
  vendorEmail: string
  vendorName: string
}

export type CreateBookingPayload = {
  serviceId: string
  vendorId?: string
  eventDate: string
  eventLocation: string
  message: string
}

/** Flexible payload for the /applications endpoint. */
export type ApplicationPayload = Record<string, unknown>

export type DashboardRole = "customer" | "vendor" | "admin"

export type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

export type BrowseFilterValues = {
  search: string
  category: string
  location: string
  sort: string
}

export type ServiceDetailPageProps = {
  params: Promise<{ id: string }>
}

export type BrowsePageProps = {
  searchParams: Promise<{
    search?: string
    category?: string
    location?: string
    sort?: string
  }>
}

export type BookingFormProps = {
  serviceId: string
  vendorId?: string
  vendorName?: string
  serviceName: string
  disabled?: boolean
  disabledReason?: string
}

/** Everything that is logged when a booking request is submitted. */
export type BookingLogPayload = {
  userRole: string
  userId: string
  userEmail: string
  vendorId: string
  vendorName: string
  eventDate: string
  serviceId: string
  serviceName: string
  message: string
}

export type ServiceFormValues = {
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  image: string
}

export type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type DatePickerProps = {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  minDate?: string
  placeholder?: string
  disabled?: boolean
}
