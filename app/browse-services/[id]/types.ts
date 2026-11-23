import type { IService } from "@/app/components/serviceCard"

export type ServiceDetail = IService & {
  images?: string[]
  status?: string
  isActive?: boolean
  vendorId?: string
  vendorEmail?: string
  vendorName?: string
  businessName?: string
  vendor?: {
    name?: string
    businessName?: string
    image?: string
    email?: string
  } | null
}

export const getServiceId = (service: ServiceDetail, fallback: string) =>
  typeof service._id === "string" ? service._id : service._id?.$oid || fallback
