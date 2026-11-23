"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type BrowseFilterValues = {
  search: string
  category: string
  location: string
  sort: string
}

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
]

const ALL = "all"
const DEFAULT_SORT = "default"

const buildUrl = (values: BrowseFilterValues) => {
  const params = new URLSearchParams()

  if (values.search.trim()) params.set("search", values.search.trim())
  if (values.category && values.category !== ALL) {
    params.set("category", values.category)
  }
  if (values.location && values.location !== ALL) {
    params.set("location", values.location)
  }
  if (values.sort && values.sort !== DEFAULT_SORT) {
    params.set("sort", values.sort)
  }

  const query = params.toString()
  return `/browse-services${query ? `?${query}` : ""}`
}

export default function BrowseFilters({
  values,
}: {
  values: BrowseFilterValues
}) {
  const router = useRouter()

  const [search, setSearch] = useState(values.search)
  const [category, setCategory] = useState(values.category || ALL)
  const [location, setLocation] = useState(values.location || ALL)
  const [sort, setSort] = useState(values.sort || DEFAULT_SORT)

  const skipInitialRender = useRef(true)

  // Stay in sync when the URL changes from outside this component
  // (browser back/forward, or the "Reset filters" link).
  useEffect(() => {
    setSearch(values.search)
    setCategory(values.category || ALL)
    setLocation(values.location || ALL)
    setSort(values.sort || DEFAULT_SORT)
  }, [values.search, values.category, values.location, values.sort])

  // Debounce every filter change so typing doesn't navigate on each keystroke.
  useEffect(() => {
    if (skipInitialRender.current) {
      skipInitialRender.current = false
      return
    }

    const timer = setTimeout(() => {
      router.replace(buildUrl({ search, category, location, sort }))
    }, 350)

    return () => clearTimeout(timer)
  }, [search, category, location, sort, router])

  const handleSelectChange = (
    key: "category" | "location" | "sort",
    value: string | null
  ) => {
    const nextValue = value ?? (key === "sort" ? DEFAULT_SORT : ALL)

    if (key === "category") setCategory(nextValue)
    if (key === "location") setLocation(nextValue)
    if (key === "sort") setSort(nextValue)
  }

  const hasActiveFilters =
    Boolean(values.search) ||
    Boolean(values.category) ||
    Boolean(values.location) ||
    Boolean(values.sort)

  const handleClear = () => {
    setSearch("")
    setCategory(ALL)
    setLocation(ALL)
    setSort(DEFAULT_SORT)
  }

  const labelClass = "mb-2 block text-xs font-bold tracking-wider text-[#6F8778] uppercase"
  const triggerClass =
    "h-11 w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F2] px-3 text-[15px] text-[#302D29] hover:bg-white focus-visible:border-[#123D30]"

  return (
    <section
      aria-label="Filter services"
      className="rounded-2xl border border-[#E5DED2] bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="service-search" className={labelClass}>
            Search by name
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6F8778]"
            />
            <Input
              id="service-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. Garden Photography"
              className="h-11 rounded-xl border border-[#E5DED2] bg-[#FAF8F2] pr-3 pl-10 text-[15px] text-[#302D29] placeholder:text-[#A9A29A] focus-visible:border-[#123D30] focus-visible:bg-white"
            />
          </div>
        </div>

        <div>
          <span className={labelClass}>Category</span>
          <Select
            value={category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="service-category" className={triggerClass}>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <span className={labelClass}>Location</span>
          <Select
            value={location}
            onValueChange={(value) => handleSelectChange("location", value)}
          >
            <SelectTrigger id="service-location" className={triggerClass}>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All locations</SelectItem>
              {DIVISIONS.map((division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <span className={labelClass}>Price</span>
          <Select
            value={sort}
            onValueChange={(value) => handleSelectChange("sort", value)}
          >
            <SelectTrigger id="service-sort" className={triggerClass}>
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_SORT}>Default order</SelectItem>
              <SelectItem value="price-asc">Low to high</SelectItem>
              <SelectItem value="price-desc">High to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#E5DED2] px-3 text-sm font-semibold text-[#6F8778] transition-colors hover:border-[#123D30] hover:text-[#123D30]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </section>
  )
}
