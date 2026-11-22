import ServiceCard from "./serviceCard"


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

export default function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5DED2] bg-white p-10 text-center">
        <h3 className="text-xl font-semibold text-[#123D30]">
          No Services Found
        </h3>
        <p className="mt-2 text-[#6F8778]">
          You haven&appost published any services yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {services.map((service) => (
        <ServiceCard
          key={typeof service._id === "string" ? service._id : service._id.$oid}
          service={service}
        />
      ))}
    </div>
  )
}
