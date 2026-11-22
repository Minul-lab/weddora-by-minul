import ServiceList from "@/app/components/serviceList"
import { getServices } from "@/lib/api/services"


export default async function MyServicesPage() {
  const response = await getServices()

  const services = Array.isArray(response)
    ? response
    : response?.data || response?.services || []

  return (
    <div className="min-h-screen bg-[#FAF8F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium tracking-widest text-[#C6A15B] uppercase">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#123D30]">My Services</h1>

          <p className="mt-2 text-[#6F8778]">
            Manage and monitor your wedding services.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#123D30]">
            Your Listings
          </h2>

          <span className="rounded-full bg-[#E8DCCB] px-4 py-1.5 text-sm font-semibold text-[#123D30]">
            {services.length} Services
          </span>
        </div>

        <ServiceList services={services} />
      </div>
    </div>
  )
}
