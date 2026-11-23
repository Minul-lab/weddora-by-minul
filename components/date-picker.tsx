"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DatePickerProps } from "@/types"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

/** Format a Date as YYYY-MM-DD using local (not UTC) calendar values. */
const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const formatDisplay = (key: string) => {
  const date = parseDateKey(key)
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// useSyncExternalStore lets the client read "today" after hydration without an
// effect-driven state update, and keeps the server snapshot deterministic.
const subscribe = () => () => {}
const getTodayKey = () => toDateKey(new Date())
const getServerTodayKey = () => ""

export default function DatePicker({
  id,
  name,
  value,
  onChange,
  minDate,
  placeholder = "Select a date",
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const todayKey = useSyncExternalStore(subscribe, getTodayKey, getServerTodayKey)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const effectiveMin = minDate || todayKey
  const minMonthDate = parseDateKey(effectiveMin)
  const minMonthIndex = minMonthDate
    ? minMonthDate.getFullYear() * 12 + minMonthDate.getMonth()
    : Number.NEGATIVE_INFINITY

  // The calendar opens on the current month (or the selected date's month).
  const anchor = parseDateKey(value) ?? parseDateKey(todayKey)
  const baseDate = anchor
    ? new Date(anchor.getFullYear(), anchor.getMonth(), 1)
    : new Date(2000, 0, 1)
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthIndex = year * 12 + month
  const leadingBlanks = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#E5DED2] bg-[#FAF8F2] px-4 text-left text-[15px] text-[#302D29] transition-colors outline-none hover:bg-white focus-visible:border-[#123D30] focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C6A15B]" />
        <span className={cn("flex-1 truncate", !value && "text-[#A9A29A]")}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 text-[#6F8778] transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose event date"
          className="absolute left-0 z-50 mt-2 w-[280px] rounded-2xl border border-[#E5DED2] bg-white p-3 shadow-[0_18px_40px_rgba(18,61,48,0.18)]"
        >
          <div className="flex items-center justify-between px-1 pb-2">
            <button
              type="button"
              aria-label="Previous month"
              disabled={monthIndex <= minMonthIndex}
              onClick={() => setMonthOffset((offset) => offset - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#123D30] transition-colors hover:bg-[#E8DCCB] disabled:cursor-not-allowed disabled:text-[#C9C2B8] disabled:hover:bg-transparent"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            <p className="text-sm font-bold text-[#123D30]">
              {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonthOffset((offset) => offset + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#123D30] transition-colors hover:bg-[#E8DCCB]"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 border-t border-[#E5DED2] pt-2 text-center">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="text-[11px] font-bold text-[#A9A29A]">
                {weekday}
              </span>
            ))}

            {Array.from({ length: leadingBlanks }, (_, index) => (
              <span key={`blank-${index}`} aria-hidden="true" />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1
              const dateKey = toDateKey(new Date(year, month, day))
              const isPast = Boolean(effectiveMin && dateKey < effectiveMin)
              const isToday = dateKey === todayKey
              const isSelected = dateKey === value

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={isPast}
                  aria-label={dateKey}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setMonthOffset(0)
                    onChange(dateKey)
                    setOpen(false)
                  }}
                  className={cn(
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors",
                    isSelected
                      ? "bg-[#123D30] font-bold text-white"
                      : "text-[#302D29] hover:bg-[#E8DCCB]",
                    !isSelected && isToday && "font-bold text-[#123D30] ring-1 ring-[#C6A15B]",
                    isPast && "cursor-not-allowed text-[#C9C2B8] hover:bg-transparent"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <p className="mt-2 border-t border-[#E5DED2] pt-2 text-center text-[11px] text-[#6F8778]">
            {todayKey ? `Today is ${formatDisplay(todayKey)}` : "Select a date for your event"}
          </p>
        </div>
      )}
    </div>
  )
}
