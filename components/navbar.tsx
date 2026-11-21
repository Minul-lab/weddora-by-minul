"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import logo from "@/app/images/Weddora Floral Gold Monogram Logo.png"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    closeMenu()
    router.push("/")
    router.refresh()
  }

  const username = session?.user?.name?.trim()
  const firstLetter = username?.charAt(0).toUpperCase() || "U"

  return (
    <header className="border-b border-[#E5DED2] bg-[#FAF8F2]">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-2 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            closeMenu()
            event.currentTarget.querySelector("button")?.focus()
          }
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Weddora home"
          onClick={closeMenu}
          className="justify-self-start"
        >
          <Image
            src={logo}
            alt="Weddora"
            width={150}
            height={75}
            className="h-14 w-28 object-contain sm:h-[75px] sm:w-[150px]"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-[#123D30] hover:bg-[#E8DCCB] focus-visible:outline-[#C6A15B] md:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            <path
              d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation content */}
        <div
          id="navbar-menu"
          className={`${
            menuOpen ? "grid" : "hidden"
          } col-span-full mt-2 gap-3 border-t border-[#E5DED2] pt-3 pb-2 md:contents`}
        >
          {/* Navigation links */}
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium text-[#302D29] transition-colors hover:bg-[#E8DCCB] hover:text-[#123D30] md:px-0 md:hover:bg-transparent"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Authentication section */}
          <div className="grid grid-cols-2 gap-3 md:flex md:justify-self-end">
            {isPending ? null : session ? (
              <DropdownMenu>
                {/* Account trigger */}
                <DropdownMenuTrigger className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#123D30] px-4 text-sm font-semibold text-white transition-colors outline-none hover:bg-[#1C5140]">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={username || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6A15B] font-bold text-[#123D30]">
                      {firstLetter}
                    </span>
                  )}

                  <span>{username || "My Account"}</span>

                  <span aria-hidden="true">⌄</span>
                </DropdownMenuTrigger>

                {/* Dropdown content */}
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      {username || "My Account"}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#123D30] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1C5140]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#123D30] px-4 text-sm font-semibold text-[#123D30] transition-colors hover:bg-[#E8DCCB]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
