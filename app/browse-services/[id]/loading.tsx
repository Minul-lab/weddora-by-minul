import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceDetailLoading() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="h-4 w-64 bg-[#E8DCCB]" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <Skeleton className="aspect-[16/10] w-full rounded-2xl bg-[#E8DCCB] sm:aspect-[16/9]" />

            <div className="mt-8 flex gap-3">
              <Skeleton className="h-6 w-32 rounded-full bg-[#E8DCCB]" />
              <Skeleton className="h-6 w-20 rounded-full bg-[#E8DCCB]" />
            </div>
            <Skeleton className="mt-4 h-10 w-3/4 bg-[#E8DCCB]" />
            <Skeleton className="mt-4 h-4 w-1/2 bg-[#E8DCCB]" />

            <div className="mt-8 rounded-2xl border border-[#E5DED2] bg-white p-6 sm:p-8">
              <Skeleton className="h-6 w-48 bg-[#E8DCCB]" />
              <Skeleton className="mt-4 h-4 w-full bg-[#E8DCCB]" />
              <Skeleton className="mt-2 h-4 w-full bg-[#E8DCCB]" />
              <Skeleton className="mt-2 h-4 w-2/3 bg-[#E8DCCB]" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-28 rounded-2xl bg-[#E8DCCB]"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-[28rem] rounded-2xl bg-[#E8DCCB]" />
            <Skeleton className="h-52 rounded-2xl bg-[#E8DCCB]" />
          </div>
        </div>
      </div>
    </main>
  )
}
