import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  SearchX,
  Tag,
  Wallet,
} from "lucide-react"
import { getServicesById } from "@/lib/api/services"
import { Toaster } from "@/components/ui/toast"
import ServiceGallery from "./components/service-gallery"
import BookingForm from "./components/booking-form"
import type { ServiceDetail, ServiceDetailPageProps } from "@/types"
import { getServiceId } from "@/lib/utils"

// Only approved and active services can be booked. The check is defensive so
// the page still behaves correctly if the backend doesn't filter them itself.
const isBookable = (service: ServiceDetail) => {
  const status = (
    service.status ??
    service.approvalStatus ??
    ""
  )
    .trim()
    .toLowerCase()

  if (status && status !== "approved" && status !== "active") return false
  if (service.isAvailable === false || service.isActive === false) return false

  return true
}

const ServiceDetailPage = async ({ params }: ServiceDetailPageProps) => {
  const { id } = await params

  let service: ServiceDetail | null = null
  let fetchFailed = false

  try {
    service = (await getServicesById(id)) as ServiceDetail
  } catch {
    fetchFailed = true
  }

  if (!service || !service.serviceName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F2] px-4 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-[#E5DED2] bg-white p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8DCCB]">
            <SearchX aria-hidden="true" className="h-8 w-8 text-[#123D30]" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#123D30]">
            Service not found
          </h1>

          <p className="mt-3 text-[15px] leading-7 text-[#6F8778]">
            {fetchFailed
              ? "We couldn't load this service right now. Please try again later."
              : "This service may have been removed, or the link might be incorrect."}
          </p>

          <Link
            href="/browse-services"
            className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-[#123D30] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1C5140]"
          >
            Browse all services
          </Link>
        </div>
      </main>
    )
  }

  const images =
    service.images && service.images.length > 0
      ? service.images
      : service.image
        ? [service.image]
        : []

  const serviceId = getServiceId(service, id)

  const vendorId =
    typeof service.vendorId === "string"
      ? service.vendorId
      : service.vendorId?.$oid

  const vendorName =
    service.vendor?.businessName ||
    service.businessName ||
    service.vendorName ||
    service.vendor?.name ||
    "Weddora Vendor"

  const vendorInitial = vendorName.charAt(0).toUpperCase()

  const status = (
    service.status ??
    service.approvalStatus ??
    ""
  )
    .trim()
    .toLowerCase()

  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Available"

  const bookable = isBookable(service)
  const disabledReason = bookable
    ? undefined
    : status
      ? `This service is currently ${status}. Only approved and active services can be booked.`
      : "This service is not currently available for new bookings."

  const price = `$${Number(service.price || 0).toLocaleString("en-US")}`

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#6F8778]"
        >
          <Link href="/" className="hover:text-[#123D30]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/browse-services" className="hover:text-[#123D30]">
            Browse Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[18rem] truncate text-[#302D29]">
            {service.serviceName}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0">
            <ServiceGallery images={images} name={service.serviceName} />

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E8DCCB] px-3 py-1 text-xs font-semibold text-[#123D30]">
                  {service.category}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6F8778] ring-1 ring-[#E5DED2]">
                  {statusLabel}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-bold text-[#123D30] sm:text-4xl">
                {service.serviceName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#6F8778]">
                <span className="flex items-center gap-2">
                  <MapPin
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#C6A15B]"
                  />
                  {service.location}
                </span>
                <span className="flex items-center gap-2">
                  <BadgeCheck
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#C6A15B]"
                  />
                  {vendorName}
                </span>
              </div>
            </div>

            <section className="mt-8 rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#123D30]">
                About this service
              </h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-8 text-[#6F8778]">
                {service.description}
              </p>
            </section>

            <section
              aria-label="Service details"
              className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-[#E5DED2] bg-white p-5">
                <Wallet aria-hidden="true" className="h-5 w-5 text-[#C6A15B]" />
                <p className="mt-3 text-xs text-[#6F8778]">Price</p>
                <p className="mt-1 font-bold text-[#302D29]">{price}</p>
              </div>

              <div className="rounded-2xl border border-[#E5DED2] bg-white p-5">
                <Tag aria-hidden="true" className="h-5 w-5 text-[#C6A15B]" />
                <p className="mt-3 text-xs text-[#6F8778]">Category</p>
                <p className="mt-1 font-bold text-[#302D29]">
                  {service.category}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DED2] bg-white p-5">
                <CalendarDays
                  aria-hidden="true"
                  className="h-5 w-5 text-[#C6A15B]"
                />
                <p className="mt-3 text-xs text-[#6F8778]">Availability</p>
                <p className="mt-1 font-bold text-[#302D29]">
                  {bookable ? "Open for bookings" : "Not available"}
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <BookingForm
              serviceId={serviceId}
              vendorId={vendorId}
              vendorName={vendorName}
              serviceName={service.serviceName}
              disabled={!bookable}
              disabledReason={disabledReason}
            />

            <section className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#123D30]">Your Vendor</h2>

              <div className="mt-4 flex items-center gap-3">
                {service.vendor?.image ? (
                  <Image
                    src={service.vendor.image}
                    alt={vendorName}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C6A15B] text-lg font-bold text-[#123D30]">
                    {vendorInitial}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="truncate font-bold text-[#123D30]">
                    {vendorName}
                  </p>
                  {service.vendor?.name &&
                    service.vendor.name !== vendorName && (
                      <p className="truncate text-sm text-[#6F8778]">
                        {service.vendor.name}
                      </p>
                    )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#6F8778]">
                Have a question? Send a booking request with your event details
                and the vendor will review it.
              </p>
            </section>

            <Link
              href="/browse-services"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#123D30] text-sm font-semibold text-[#123D30] transition-colors hover:bg-[#E8DCCB]"
            >
              <ArrowLeft aria-hidden="true" />
              Back to all services
            </Link>
          </aside>
        </div>
      </div>

      <Toaster />
    </main>
  )
}

export default ServiceDetailPage
