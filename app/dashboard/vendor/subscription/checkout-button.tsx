"use client"

import { useState } from "react"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { toast } from "@/components/ui/toast"

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const startCheckout = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await fetch("/api/checkout_sessions", { method: "POST" })
      const result = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Unable to start checkout. Please try again.")
      }

      window.location.assign(result.url)
    } catch (error) {
      toast.add({
        type: "error",
        title: "Checkout unavailable",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
      })
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C6A15B] px-5 text-sm font-bold text-[#123D30] transition hover:bg-[#D8B96F] disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      {loading ? "Taking you to Stripe…" : "Upgrade to Premium"}
    </button>
  )
}
