import type { CreateServicePayload } from "@/types"

const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000"

export const CreateServices = async (data: CreateServicePayload) => {
  const res = await fetch(`${BaseUrl}/services`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create service")
  }

  return res.json()
}

export const DeleteService = async (jobId: string) => {
  const res = await fetch(`${BaseUrl}/services/${jobId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to delete service")
  }

  return res.json()
}
