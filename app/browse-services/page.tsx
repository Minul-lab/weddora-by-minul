import { getServices } from "@/lib/api/services"
import { IService } from "../components/serviceCard"

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    location?: string
  }>
}

const BrowsePage = async ({ searchParams }: Props) => {
  const params = await searchParams

  const services = await getServices({
    search: params.search,
    category: params.category,
    location: params.location,
  })

  return (
    <div>
      {services.map((service:IService) => (
        <div key={typeof service._id === "string" ? service._id : service._id.$oid}>
          <h2>{service.serviceName}</h2>
          <p>{service.category}</p>
          <p>{service.location}</p>
        </div>
      ))}
    </div>
  )
}

export default BrowsePage
