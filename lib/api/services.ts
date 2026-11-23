import { IService } from "@/app/components/serviceCard";

const BaseUrl = process.env.SERVER_DEFAULT_API || "http://localhost:8000";
export type ServiceFilters = {
  search?: string;
  category?: string;
  location?: string;
};

export const getServices = async (
  filters: ServiceFilters = {}
): Promise<IService[]> => {
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