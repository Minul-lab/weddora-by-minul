"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight, MapPin, UserRound } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import type { IService } from "@/app/components/serviceCard"

export type BrowseService = IService & {
  images?: string[]
  status?: string
  isActive?: boolean
  vendorName?: string
  businessName?: string
  vendor?: {
    name?: string
    businessName?: string
    image?: string
  } | null
}

const getServiceImage = (service: BrowseService) =>
  service.image || service.images?.[0] || ""

const getVendorName = (service: BrowseService) =>
  service.vendor?.businessName ||
  service.businessName ||
  service.vendorName ||
  service.vendor?.name ||
  "Weddora Vendor"

const getServiceId = (service: BrowseService) =>
  typeof service._id === "string" ? service._id : service._id?.$oid || ""

export default function BrowseServiceCard({
  service,
}: {
  service: BrowseService
}) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const image = getServiceImage(service)
  const vendorName = getVendorName(service)
  const serviceId = getServiceId(service)

  const handleViewDetails = () => {
    if (!serviceId || isPending) return

    const detailsUrl = `/services/${serviceId}`

    if (session) {
      router.push(detailsUrl)
      return
    }

    router.push(`/sign-in?redirect=${encodeURIComponent(detailsUrl)}`)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5DED2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,61,48,0.12)]">
      <div className="relative h-52 w-full overflow-hidden bg-[#E8DCCB] sm:h-56">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-[#123D30]/30">
            W
          </div>
        )}

        <span className="absolute top-3 left-3 rounded-full bg-[#FAF8F2]/95 px-3 py-1 text-xs font-semibold text-[#123D30] shadow-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xl leading-snug font-bold text-[#123D30]">
            {service.serviceName}
          </h3>

          <span className="shrink-0 rounded-full bg-[#123D30] px-3 py-1 text-sm font-bold text-[#FAF8F2]">
            ${Number(service.price || 0).toLocaleString("en-US")}
          </span>
        </div>

        {service.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F8778]">
            {service.description}
          </p>
        )}

        <div className="mt-5 space-y-2.5 border-t border-[#E5DED2] pt-4 text-sm text-[#302D29]">
          <div className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C6A15B]" />
            <span className="truncate">{service.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <UserRound aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C6A15B]" />
            <span className="truncate">{vendorName}</span>
          </div>
        </div>

        <Button
          type="button"
          disabled={isPending || !serviceId}
          onClick={handleViewDetails}
          className="mt-6 h-11 w-full rounded-xl bg-[#123D30] text-sm font-semibold text-white hover:bg-[#1C5140]"
        >
          View Details
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
