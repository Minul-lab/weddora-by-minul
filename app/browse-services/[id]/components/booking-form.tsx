"use client"

import { useState, type FormEvent } from "react"
import { MapPin, MessageSquareText, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import DatePicker from "@/components/date-picker"

import type { BookingFormProps } from "@/types"
import { CreateApplication } from "@/lib/actions/application"

export default function BookingForm({
  serviceId,
  serviceName,
  disabled = false,
  disabledReason,
}: BookingFormProps) {
  const { data: session } = authClient.useSession()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventDate, setEventDate] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 1. Check authentication
    if (!session?.user) {
      toast.add({
        type: "error",
        title: "Login required",
        description: "Please log in to request a booking.",
      })
      return
    }

    // 2. Only customers can book
    if (session.user.role !== "customer") {
      toast.add({
        type: "error",
        title: "Access denied",
        description: "Only customers can request bookings.",
      })
      return
    }

    // 3. Get form data
    const form = event.currentTarget
    const formData = new FormData(form)

    const selectedDate = String(formData.get("eventDate") ?? "")
    const eventLocation = String(formData.get("eventLocation") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()

    // 4. Validate required fields
    if (!selectedDate || !eventLocation) {
      toast.add({
        type: "error",
        title: "Missing details",
        description: "Please add an event date and location.",
      })
      return
    }

    // 5. Validate date
    const today = new Date()

    const minDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

    if (selectedDate < minDate) {
      toast.add({
        type: "error",
        title: "Invalid date",
        description: "Please choose today or a future date.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // 6. Prepare application payload
      const applicationData = {
        serviceId,
        eventDate: selectedDate,
        eventLocation,
        message,
      }

      // 7. Log details
      // 8. Send POST request to /applications
      await CreateApplication(applicationData)

      toast.add({
        type: "success",
        title: "Request sent",
        description: `Your request for ${serviceName} was sent to the vendor.`,
      })

      // 9. Reset form
      form.reset()
      setEventDate("")
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
              Event Date
            </label>

            <DatePicker
              id="eventDate"
              name="eventDate"
              value={eventDate}
              onChange={setEventDate}
              placeholder="Choose a date"
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
            disabled={
              isSubmitting || !session?.user || session.user.role !== "customer"
            }
            className="h-12 w-full rounded-xl bg-[#C6A15B] text-base font-bold text-[#123D30] hover:bg-[#b9914c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send aria-hidden="true" />

            {isSubmitting
              ? "Sending request..."
              : !session?.user
                ? "Login to Book"
                : session.user.role !== "customer"
                  ? "Customers Only"
                  : "Send Booking Request"}
          </Button>

          <p className="text-center text-xs leading-5 text-[#6F8778]">
            Your request will be pending until the vendor accepts or rejects it.
          </p>
        </form>
      )}
    </section>
  )
}
