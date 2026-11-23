import type {
  IService,
  ServiceFilters,
  ServicesResponse,
} from "@/types";

const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";

export const getServices = async (
  filters: ServiceFilters = {}
): Promise<ServicesResponse> => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.location) {
    params.set("location", filters.location);
  }

  const queryString = params.toString();

  const res = await fetch(
    `${BaseUrl}/services${queryString ? `?${queryString}` : ""}`
  );

  const data = await res.json();

  return data;
};

export const getServicesById = async (
  id: string
): Promise<IService> => {
  const res = await fetch(`${BaseUrl}/services/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch service details");
  }

  const data = await res.json();
  return data;
};

//service count
export const getServiceCount = async (vendorId?: string): Promise<number> => {
  const params = new URLSearchParams();

  if (vendorId) {
    params.set("vendorId", vendorId);
  }

  const res = await fetch(
    `${BaseUrl}/services/count?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch service count");
  }

  const data = await res.json();

  return data.count;
};
