type Service = {
  _id: string | { $oid: string }
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  image: string
  approvalStatus?: string
  isAvailable?: boolean
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5DED2] bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="h-56 w-full shrink-0 sm:h-auto sm:w-64">
          <img
            src={service.image}
            alt={service.serviceName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-[#E8DCCB] px-3 py-1 text-xs font-semibold text-[#123D30]">
                {service.category}
              </span>

              <span className="rounded-full bg-[#FAF8F2] px-3 py-1 text-xs text-[#6F8778]">
                {service.approvalStatus || "Approval: Not provided"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#123D30]">
              {service.serviceName}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6F8778]">
              {service.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#6F8778]">Price</p>
                <p className="mt-1 font-semibold text-[#302D29]">
                  ${service.price}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#6F8778]">Location</p>
                <p className="mt-1 font-semibold text-[#302D29]">
                  {service.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#6F8778]">Availability</p>
                <p className="mt-1 font-semibold text-[#302D29]">
                  {service.isAvailable === undefined
                    ? "Not configured"
                    : service.isAvailable
                      ? "Available"
                      : "Unavailable"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#E5DED2] pt-5">
            <button
              type="button"
              className="rounded-xl border border-[#123D30] px-5 py-2 text-sm font-semibold text-[#123D30]"
            >
              Update
            </button>

            <button
              type="button"
              className="rounded-xl border border-red-200 px-5 py-2 text-sm font-semibold text-red-600"
            >
              Delete
            </button>

            <button
              type="button"
              className="rounded-xl bg-[#FAF8F2] px-4 py-2 text-sm font-medium text-[#6F8778]"
            >
              Manage Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
