import { Skeleton } from "@/components/ui/skeleton"

export default function BrowseServicesLoading() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="h-4 w-28 bg-[#E8DCCB]" />
        <Skeleton className="mt-3 h-12 w-80 max-w-full bg-[#E8DCCB]" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl bg-[#E8DCCB]" />
        <Skeleton className="mt-2 h-5 w-2/3 max-w-md bg-[#E8DCCB]" />

        <div className="mt-8 rounded-2xl border border-[#E5DED2] bg-white p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="mb-2 h-3 w-24 bg-[#E8DCCB]" />
                <Skeleton className="h-11 w-full rounded-xl bg-[#E8DCCB]" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="mt-7 h-4 w-32 bg-[#E8DCCB]" />

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#E5DED2] bg-white"
            >
              <Skeleton className="h-52 w-full rounded-none bg-[#E8DCCB] sm:h-56" />
              <div className="space-y-4 p-5 sm:p-6">
                <Skeleton className="h-6 w-4/5 bg-[#E8DCCB]" />
                <Skeleton className="h-4 w-full bg-[#E8DCCB]" />
                <Skeleton className="h-4 w-2/3 bg-[#E8DCCB]" />
                <Skeleton className="h-11 w-full rounded-xl bg-[#E8DCCB]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
