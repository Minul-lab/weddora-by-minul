"use client"

import { useState } from "react"
import Link from "next/link"
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F2] px-4 py-8">
      <section className="w-full max-w-[520px] rounded-[24px] border border-[#E5DED2] bg-white px-6 py-9 shadow-[0_20px_60px_rgba(18,61,48,0.08)] sm:px-10 sm:py-11">
        <h1 className="text-center font-serif text-4xl font-bold text-[#123D30]">
          Welcome Back
        </h1>

        <p className="mt-3 text-center text-[15px] text-[#6F8778]">
          Sign in to continue to your Weddora account.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#123D30]"
            >
              Email Address
            </label>

            <div className="relative">
              <FiMail
                aria-hidden="true"
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#6F8778]"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                className="min-h-14 w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] py-3 pr-4 pl-12 text-[15px] text-[#302D29] transition outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-[#123D30]"
            >
              Password
            </label>

            <div className="relative">
              <FiLock
                aria-hidden="true"
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#6F8778]"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                className="min-h-14 w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] py-3 pr-12 pl-12 text-[15px] text-[#302D29] transition outline-none placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#6F8778] hover:text-[#123D30] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:outline-none"
              >
                {showPassword ? (
                  <FiEyeOff aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <FiEye aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="min-h-14 w-full rounded-2xl bg-[#123D30] px-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#1C5140] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-[#E5DED2]" />
          <span className="text-xs tracking-wider text-[#A9A29A]">
            OR SIGN IN WITH
          </span>
          <span className="h-px flex-1 bg-[#E5DED2]" />
        </div>

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#E5DED2] bg-white px-4 text-[17px] font-bold text-[#302D29] transition-colors hover:bg-[#FAF8F2] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <FcGoogle aria-hidden="true" className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-7 text-center text-[15px] text-[#6F8778]">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-bold text-[#123D30] hover:text-[#1C5140]"
          >
            Create Account
          </Link>
        </p>
      </section>
    </main>
  )
}
