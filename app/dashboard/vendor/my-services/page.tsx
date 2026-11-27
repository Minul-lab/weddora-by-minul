import ServiceCard from "@/app/components/serviceCard"
import { getServices } from "@/lib/api/services"
import type { IService } from "@/types"
import { getServiceId } from "@/lib/utils"

import { getServerSession } from "@/lib/core/getsession"


export default async function MyServicesPage() {
  const session = await getServerSession()
  
  const response = await getServices()

  const services = Array.isArray(response)
    ? response
    : response?.data || response?.services || []

  return (
    <div className="min-h-full bg-[#FAF8F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium tracking-widest text-[#C6A15B] uppercase">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#123D30]">My Services</h1>

          <p className="mt-2 text-[#6F8778]">
            Manage and monitor your wedding services.
          </p>
        </div>

        {/* Listings Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#123D30]">
            Your Listings
          </h2>

          <span className="rounded-full bg-[#E8DCCB] px-4 py-1.5 text-sm font-semibold text-[#123D30]">
            {services.length} Services
          </span>
        </div>

        {/* Services */}
        {services.length === 0 ? (
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-10 text-center">
            <h3 className="text-xl font-semibold text-[#123D30]">
              No Services Found
            </h3>

            <p className="mt-2 text-[#6F8778]">
              You haven&apost published any services yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {services.map((service: IService) => (
              <ServiceCard
                key={getServiceId(service)}
                service={service}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
