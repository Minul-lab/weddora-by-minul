"use client"


import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  BriefcaseBusiness,
  Headset,
 
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function PaymentPage() {
 
  const premiumFeatures = [
    "Unlimited service listings",
    "Everything in the Free plan",
    "Increased business visibility",
    "Priority customer support",
    "Premium vendor badge",
    "Advanced business insights",
  ]

  const freeFeatures = [
    "List up to 10 services",
    "Vendor dashboard access",
    "Receive customer applications",
    "Manage service listings",
    "Basic vendor profile",
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#123D30] text-[#C6A15B] shadow-md">
            <Crown size={32} />
          </div>

          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[#C6A15B] uppercase">
            Weddora Membership
          </p>

          <h1 className="text-3xl font-bold text-[#123D30] sm:text-4xl">
            Grow Your Wedding Business
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6F8778] sm:text-base">
            Unlock more opportunities, showcase unlimited services and take your
            business to the next level.
          </p>
        </div>

        {/* Limit Notice */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C6A15B]/15 text-[#A47C35]">
            <BriefcaseBusiness size={24} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-[#123D30]">
              You&apos;ve reached your free listing limit
            </h3>

            <p className="mt-1 text-sm text-[#6F8778]">
              Upgrade to Premium to publish unlimited services.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#F7EBD5] px-4 py-2 text-xs font-semibold text-[#96702E]">
            10 / 10 Services
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-3xl border border-[#E5DED2] bg-white p-7 shadow-sm sm:p-8">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF8F2] text-[#123D30]">
                <ShieldCheck size={25} />
              </div>

              <h2 className="text-2xl font-bold text-[#123D30]">Free</h2>

              <p className="mt-2 text-sm text-[#6F8778]">
                Perfect for getting started with Weddora.
              </p>
            </div>

            <div className="mb-7 border-b border-[#E5DED2] pb-7">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#123D30]">$0</span>

                <span className="text-sm text-[#8A938B]">/ forever</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-5 text-sm font-semibold text-[#123D30]">
                What&apos;s included:
              </p>

              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#52665A]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#123D30]/10 text-[#123D30]">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              disabled
              className="mt-9 h-12 w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F2] text-sm font-semibold text-[#123D30] opacity-100"
            >
              Free Plan
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col rounded-3xl border border-[#C6A15B] bg-white p-7 shadow-md sm:p-8">
            <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#123D30] px-5 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-md">
              <Sparkles size={14} className="text-[#C6A15B]" />
              RECOMMENDED
            </div>

            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF8F2] text-[#C6A15B]">
                <Crown size={25} />
              </div>

              <h2 className="text-2xl font-bold text-[#123D30]">Premium</h2>

              <p className="mt-2 text-sm text-[#6F8778]">
                Grow your wedding business without limits.
              </p>
            </div>

            <div className="mb-7 border-b border-[#E5DED2] pb-7">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#123D30]">$20</span>

                <span className="text-sm text-[#8A938B]">/ month</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-5 text-sm font-semibold text-[#123D30]">
                Everything included:
              </p>

              <ul className="space-y-4">
                {premiumFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#52665A]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#123D30]/10 text-[#123D30]">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>


            <form action="/api/checkout_sessions" method="POST">
              <section>
                <button
                  type="submit"
                  role="link"
                  className="mt-9 h-12 w-full rounded-xl bg-[#123D30] text-sm font-semibold text-white transition-colors hover:bg-[#1C5140] disabled:opacity-70"
                >
                  Checkout
                </button>
              </section>
            </form>

            <p className="mt-3 text-center text-xs text-[#8A938B]">
              Secure subscription powered by Stripe
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid gap-6 border-t border-[#E5DED2] pt-10 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#C6A15B] shadow-sm">
              <Zap size={22} />
            </div>

            <h3 className="font-semibold text-[#123D30]">Grow Faster</h3>

            <p className="mt-2 text-sm text-[#6F8778]">
              Expand your business and showcase more services.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#C6A15B] shadow-sm">
              <Crown size={22} />
            </div>

            <h3 className="font-semibold text-[#123D30]">Stand Out</h3>

            <p className="mt-2 text-sm text-[#6F8778]">
              Build trust with a premium vendor profile.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#C6A15B] shadow-sm">
              <Headset size={22} />
            </div>

            <h3 className="font-semibold text-[#123D30]">Priority Support</h3>

            <p className="mt-2 text-sm text-[#6F8778]">
              Get additional support for your business.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#8A938B]">
            Secure payments and subscription management with Stripe.
          </p>

          <p className="mt-2 text-sm font-medium text-[#123D30]">
            Weddora — Plan your business, grow your future.
          </p>
        </div>
      </div>
    </div>
  )
}
