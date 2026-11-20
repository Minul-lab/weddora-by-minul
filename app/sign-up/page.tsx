"use client"

import { useState } from "react"
import Link from "next/link"

export default function SignUpPage() {
  const [role, setRole] = useState<"vendor" | "customer">("customer")

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-8 font-serif sm:py-12">
      <div className="mx-auto w-full max-w-[520px] rounded-[24px] border border-[#E5DED2] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(18,61,48,0.08)] sm:px-10 sm:py-10">
        <h1 className="text-center text-4xl font-bold text-[#123D30]">
          Create Account
        </h1>
        <p className="mt-3 text-center text-[15px] text-[#6F8778]">
          Join Weddora and plan your perfect celebration.
        </p>

        <div className="mt-7">
          <span className="mb-2 block text-sm font-bold text-[#123D30]">
            I am joining as
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={role === "vendor"}
              onClick={() => setRole("vendor")}
              className={`rounded-xl border-2 px-4 py-3.5 text-[15px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none ${
                role === "vendor"
                  ? "border-[#123D30] bg-[#123D30] text-white"
                  : "border-[#E5DED2] bg-[#FAF8F2] text-[#123D30] hover:border-[#123D30]"
              }`}
            >
              Vendor
            </button>
            <button
              type="button"
              aria-pressed={role === "customer"}
              onClick={() => setRole("customer")}
              className={`rounded-xl border-2 px-4 py-3.5 text-[15px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none ${
                role === "customer"
                  ? "border-[#123D30] bg-[#123D30] text-white"
                  : "border-[#E5DED2] bg-[#FAF8F2] text-[#123D30] hover:border-[#123D30]"
              }`}
            >
              Customer
            </button>
          </div>
          <input type="hidden" name="role" value={role} />
        </div>

        <form className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-bold text-[#123D30]"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              required
              className="min-h-14 w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-5 text-[15px] text-[#302D29] transition outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#123D30]"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
              className="min-h-14 w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-5 text-[15px] text-[#302D29] transition outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
            />
          </div>

          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <label
                htmlFor="profileImage"
                className="text-sm font-bold text-[#123D30]"
              >
                Profile Photo
              </label>
              <span className="text-xs text-[#6F8778]">(Optional)</span>
            </div>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              className="sr-only"
            />
            <label
              htmlFor="profileImage"
              className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-5 transition hover:border-[#123D30]"
            >
              <span className="truncate text-[15px] text-[#A9A29A]">
                Choose profile photo
              </span>
              <span className="shrink-0 rounded-lg bg-[#E8DCCB] px-3.5 py-2 text-xs font-bold tracking-wide text-[#123D30] uppercase">
                Browse
              </span>
            </label>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-[#123D30]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              required
              className="min-h-14 w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-5 text-[15px] text-[#302D29] transition outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
            />
            <div className="mt-3">
              <p className="text-[13px] text-[#6F8778]">
                Password must contain:
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-[#6F8778]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />
                  At least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />
                  At least one lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />
                  At least 6 characters long
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="min-h-14 w-full rounded-2xl bg-[#123D30] px-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#1C5140] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-[#E5DED2]" />
          <span className="text-xs tracking-wider text-[#A9A29A]">
            OR SIGN UP WITH
          </span>
          <span className="h-px flex-1 bg-[#E5DED2]" />
        </div>

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#E5DED2] bg-white px-4 text-[17px] font-bold text-[#302D29] transition-colors hover:bg-[#FAF8F2] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="text-[22px] leading-none font-black">G</span>
          Continue with Google
        </button>

        <p className="mt-7 text-center text-[15px] text-[#6F8778]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-[#123D30] hover:text-[#1C5140]"
          >
            Login Now
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-[#6F8778]">
        Welcome to your forever celebration partner.
      </p>
    </main>
  )
}
