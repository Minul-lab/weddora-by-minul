import Link from "next/link"
import { SearchX } from "lucide-react"
import { getServices } from "@/lib/api/services"
import BrowseFilters from "./components/browse-filters"
import BrowseServiceCard, {
  type BrowseService,
} from "./components/browse-service-card"

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    location?: string
    sort?: string
  }>
}

const BrowsePage = async ({ searchParams }: Props) => {
  const params = await searchParams

  const filters = {
    search: params.search ?? "",
    category: params.category ?? "",
    location: params.location ?? "",
    sort: params.sort ?? "",
  }

  let services: BrowseService[] = []
  let fetchFailed = false

  try {
    const response = await getServices({
      search: filters.search,
      category: filters.category,
      location: filters.location,
    })

    services = (
      Array.isArray(response)
        ? response
        : ((response as { data?: BrowseService[]; services?: BrowseService[] })
            ?.data ??
          (response as { data?: BrowseService[]; services?: BrowseService[] })
            ?.services ??
          [])
    ) as BrowseService[]
  } catch {
    fetchFailed = true
  }

  // Only approved and available services are public. Fields are checked
  // defensively so a backend that already filters them is still compatible.
  const visibleServices = services.filter((service) => {
    const status = (
      service.status ??
      (service as { approvalStatus?: string }).approvalStatus ??
      ""
    ).toLowerCase()

    if (status && status !== "approved" && status !== "active") return false
    if (service.isAvailable === false || service.isActive === false) return false

    return true
  })

  const sortedServices = [...visibleServices]

  if (filters.sort === "price-asc" || filters.sort === "price-desc") {
    sortedServices.sort((a, b) => {
      const priceA = Number(a.price) || 0
      const priceB = Number(b.price) || 0
      return filters.sort === "price-desc" ? priceB - priceA : priceA - priceB
    })
  }

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.location) ||
    Boolean(filters.sort)

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold tracking-widest text-[#C6A15B] uppercase">
          Explore Weddora
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold text-[#123D30] sm:text-5xl">
          Browse Wedding Services
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6F8778]">
          Discover trusted vendors for every moment of your big day. Search,
          filter, and find the perfect match for your celebration.
        </p>

        <div className="mt-8">
          <BrowseFilters values={filters} />
        </div>

        <div className="mt-7 mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#6F8778]">
            {fetchFailed
              ? "Unable to load services right now."
              : `Showing ${sortedServices.length} ${
                  sortedServices.length === 1 ? "service" : "services"
                }`}
          </p>

          {hasActiveFilters && (
            <Link
              href="/browse-services"
              className="text-sm font-semibold text-[#123D30] underline underline-offset-4 hover:text-[#1C5140]"
            >
              Reset filters
            </Link>
          )}
        </div>

        {fetchFailed ? (
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-[#123D30]">
              Something went wrong
            </h2>
            <p className="mt-2 text-[#6F8778]">
              We couldn&apos;t load the services. Please try again later.
            </p>
          </div>
        ) : sortedServices.length === 0 ? (
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-10 text-center sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8DCCB]">
              <SearchX aria-hidden="true" className="h-8 w-8 text-[#123D30]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#123D30]">
              No services found
            </h2>

            <p className="mt-2 text-[#6F8778]">
              {hasActiveFilters
                ? "Try changing your search or filters to see more services."
                : "There are no published services available just yet."}
            </p>

            {hasActiveFilters && (
              <Link
                href="/browse-services"
                className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#123D30] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1C5140]"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedServices.map((service) => {
              const id =
                typeof service._id === "string"
                  ? service._id
                  : service._id?.$oid || ""

              return (
                <BrowseServiceCard key={id || service.serviceName} service={service} />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default BrowsePage
