import type { ObjectIdRef } from "@/types"

export { cn } from "cn"

/** Resolve a Mongo ObjectId that may be a string or an extended-JSON object. */
export function getServiceId(
  service: { _id?: ObjectIdRef },
  fallback = ""
): string {
  if (typeof service._id === "string") return service._id
  return service._id?.$oid ?? fallback
}
