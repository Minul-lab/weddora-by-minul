"use client"

import { useState } from "react"
import Image from "next/image"

export default function ServiceGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const photos = images.filter(Boolean)
  const activePhoto = photos[activeIndex] ?? photos[0] ?? ""

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#E5DED2] bg-[#E8DCCB] sm:aspect-[16/9]">
        {activePhoto ? (
          <Image
            src={activePhoto}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl font-bold text-[#123D30]/25">
            W
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                index === activeIndex
                  ? "border-[#C6A15B]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
