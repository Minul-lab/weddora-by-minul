const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000"

export type CreateBookingPayload = {
  serviceId: string
  vendorId?: string
  eventDate: string
  eventLocation: string
  message: string
}

export const createBooking = async (data: CreateBookingPayload) => {
  const res = await fetch(`${BaseUrl}/bookings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let message = "Failed to submit your booking request"

    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      // Keep the generic message when the server sends no JSON body.
    }

    throw new Error(message)
  }

  return res.json()
}
