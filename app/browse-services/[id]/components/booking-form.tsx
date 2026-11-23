"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CalendarDays, MapPin, MessageSquareText, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { createBooking } from "@/lib/api/bookings"

type Props = {
  serviceId: string
  vendorId?: string
  serviceName: string
  disabled?: boolean
  disabledReason?: string
}

export default function BookingForm({
  serviceId,
  vendorId,
  serviceName,
  disabled = false,
  disabledReason,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [minDate, setMinDate] = useState("")

  // Set on the client so server and client markup stay identical on hydration.
  useEffect(() => {
    setMinDate(new Date().toISOString().slice(0, 10))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const eventDate = String(formData.get("eventDate") ?? "")
    const eventLocation = String(formData.get("eventLocation") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()

    if (!eventDate || !eventLocation) {
      toast.add({
        type: "error",
        title: "Missing details",
        description: "Please add an event date and location.",
      })
      return
    }

    if (minDate && eventDate < minDate) {
      toast.add({
        type: "error",
        title: "Invalid date",
        description: "Please choose today or a future date.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await createBooking({
        serviceId,
        vendorId,
        eventDate,
        eventLocation,
        message,
      })

      toast.add({
        type: "success",
        title: "Request sent",
        description: `Your request for ${serviceName} was sent to the vendor.`,
      })
      form.reset()
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not send request",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5DED2] bg-white shadow-sm">
      <div className="border-b border-[#E5DED2] bg-[#123D30] px-6 py-5">
        <h2 className="text-xl font-bold text-white">Request a Booking</h2>
        <p className="mt-1 text-sm text-white/75">
          Tell the vendor about your event and they&apos;ll get back to you.
        </p>
      </div>

      {disabled ? (
        <div className="px-6 py-10 text-center">
          <p className="text-base font-semibold text-[#123D30]">
            Booking unavailable
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6F8778]">
            {disabledReason ??
              "This service is not currently available for new bookings."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label
              htmlFor="eventDate"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#123D30]"
            >
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              Event Date
            </label>
            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              min={minDate}
              required
              className="h-12 rounded-xl border-[#E5DED2] bg-[#FAF8F2] px-4 text-[15px] focus-visible:border-[#123D30] focus-visible:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="eventLocation"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#123D30]"
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Event Location
            </label>
            <Input
              id="eventLocation"
              name="eventLocation"
              type="text"
              placeholder="e.g. Gulshan, Dhaka"
              required
              className="h-12 rounded-xl border-[#E5DED2] bg-[#FAF8F2] px-4 text-[15px] focus-visible:border-[#123D30] focus-visible:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#123D30]"
            >
              <MessageSquareText aria-hidden="true" className="h-4 w-4" />
              Additional Message
              <span className="font-normal text-[#A9A29A]">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Share any details about your celebration..."
              className="w-full resize-none rounded-xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#C6A15B] text-base font-bold text-[#123D30] hover:bg-[#b9914c]"
          >
            <Send aria-hidden="true" />
            {isSubmitting ? "Sending request..." : "Send Booking Request"}
          </Button>

          <p className="text-center text-xs leading-5 text-[#6F8778]">
            Your request will be pending until the vendor accepts or rejects it.
          </p>
        </form>
      )}
    </section>
  )
}
