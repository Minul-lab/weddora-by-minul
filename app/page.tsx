import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChefHat,
  Flower2,
  Heart,
  MapPin,
  Sparkles,
  Store,
} from "lucide-react"
import { getServices } from "@/lib/api/services"
import type { BrowseService } from "@/types"

const categories = [
  { name: "Photography & Videography", short: "Photography", icon: Camera },
  { name: "Wedding Venues", short: "Venues", icon: Heart },
  { name: "Decoration & Florist", short: "Florals & décor", icon: Flower2 },
  { name: "Catering Services", short: "Catering", icon: ChefHat },
  { name: "Makeup & Styling", short: "Beauty", icon: Sparkles },
  { name: "Wedding Fashion", short: "Wedding fashion", icon: Store },
]

const heroImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=90"

function getServiceImage(service: BrowseService) {
  return service.image || service.images?.[0] || ""
}

function getServiceId(service: BrowseService) {
  return typeof service._id === "string" ? service._id : service._id?.$oid || ""
}

function getVendorName(service: BrowseService) {
  return (
    service.vendor?.businessName ||
    service.businessName ||
    service.vendorName ||
    service.vendor?.name ||
    "Weddora partner"
  )
}

function isPublicService(service: BrowseService) {
  const status = (service.status ?? service.approvalStatus ?? "").toLowerCase()
  if (status && status !== "approved" && status !== "active") return false
  return service.isAvailable !== false && service.isActive !== false
}

async function getFeaturedServices() {
  try {
    const response = await getServices()
    const services = Array.isArray(response)
      ? response
      : response.data ?? response.services ?? []

    return (services as BrowseService[]).filter(isPublicService).slice(0, 6)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredServices = await getFeaturedServices()

  return (
    <main className="overflow-hidden bg-[#FAF8F2] text-[#302D29]">
      <section className="relative isolate min-h-[610px] overflow-hidden bg-[#123D30] sm:min-h-[690px]">
        <Image
          src={heroImage}
          alt="An intimate outdoor wedding celebration beneath a canopy of lights"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c2e25]/90 via-[#123D30]/70 to-[#123D30]/20" />

        <div className="mx-auto flex min-h-[610px] max-w-7xl items-center px-5 py-20 sm:min-h-[690px] sm:px-8 lg:px-12">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#F0D9A7] uppercase backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Your day, beautifully planned
            </span>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl leading-[1.08] font-medium tracking-tight text-[#FAF8F2] sm:text-6xl lg:text-7xl">
              The beginning of your <span className="text-[#D6B771]">forever</span>
              , made effortless.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Find the people who make your kind of celebration possible. Discover
              trusted wedding vendors, gather inspiration, and bring every detail
              together in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/browse-services"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#C6A15B] px-6 text-sm font-bold text-[#123D30] transition hover:bg-[#D8B96F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF8F2]"
              >
                Explore wedding services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Join as a vendor
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-3 text-sm text-white/75">
              <div className="flex -space-x-2" aria-hidden="true">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                ].map((photo) => (
                  <Image
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full border-2 border-[#123D30] object-cover"
                  />
                ))}
              </div>
              <span>Made for the moments that matter most</span>
            </div>
          </div>
        </div>
        <div className="absolute right-8 bottom-8 hidden items-center gap-3 text-xs tracking-[0.18em] text-white/70 uppercase lg:flex">
          <span className="h-px w-10 bg-[#C6A15B]" />
          A little more you, in every detail
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="categories-heading">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#A98542] uppercase">Start with what you need</p>
            <h2 id="categories-heading" className="mt-3 font-serif text-3xl font-medium text-[#123D30] sm:text-4xl">
              Find your kind of wonderful
            </h2>
          </div>
          <Link href="/browse-services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#123D30] hover:text-[#A98542]">
            View all services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, short, icon: Icon }, index) => (
            <Link
              key={name}
              href={`/browse-services?category=${encodeURIComponent(name)}`}
              style={{ animationDelay: `${index * 70}ms` }}
              className="group animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-[#E5DED2] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#C6A15B]/70 hover:shadow-[0_16px_35px_rgba(18,61,48,0.08)] sm:p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E5] text-[#123D30] transition group-hover:bg-[#123D30] group-hover:text-[#D6B771]">
                <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span className="mt-5 block text-sm leading-5 font-semibold text-[#123D30]">{short}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#7A8177]">Explore <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#A98542] uppercase">Thoughtfully selected</p>
              <h2 id="featured-heading" className="mt-3 font-serif text-3xl font-medium text-[#123D30] sm:text-4xl">People to make it unforgettable</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F8778]">Meet a few of the talented local professionals ready to make your plans feel personal.</p>
            </div>
            <Link href="/browse-services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#123D30] hover:text-[#A98542]">
              Discover all vendors <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredServices.length ? (
            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service, index) => {
                const image = getServiceImage(service)
                const id = getServiceId(service)

                return (
                  <Link
                    key={id || service.serviceName}
                    href={id ? `/browse-services/${id}` : "/browse-services"}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="group animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-2xl border border-[#E8E1D6] bg-[#FAF8F2] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,61,48,0.12)]"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#E8DCCB]">
                      {image ? (
                        <Image src={image} alt={service.serviceName} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-serif text-6xl text-[#123D30]/25">W</div>
                      )}
                      <span className="absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-[#FAF8F2]/95 px-3 py-1.5 text-xs font-semibold text-[#123D30]">{service.category}</span>
                      <span className="absolute right-4 bottom-4 rounded-full bg-[#123D30] px-3 py-1.5 text-sm font-bold text-[#FAF8F2]">${Number(service.price || 0).toLocaleString("en-US")}</span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <h3 className="truncate font-serif text-xl font-medium text-[#123D30]">{service.serviceName}</h3>
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#6F8778]">{service.description || "A trusted wedding professional, ready to help bring your day to life."}</p>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E5DED2] pt-4 text-sm text-[#6F8778]">
                        <span className="flex min-w-0 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#C6A15B]" /><span className="truncate">{service.location}</span></span>
                        <span className="max-w-[45%] truncate font-medium text-[#123D30]">{getVendorName(service)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="mt-9 rounded-2xl border border-dashed border-[#D9CFBC] bg-[#FAF8F2] px-6 py-12 text-center">
              <p className="font-serif text-xl text-[#123D30]">Wonderful things are being planned.</p>
              <p className="mt-2 text-sm text-[#6F8778]">New vendor services are on their way. Check back soon or browse what&apos;s available.</p>
              <Link href="/browse-services" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#123D30] px-5 text-sm font-semibold text-white hover:bg-[#1C5140]">Browse services</Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:py-28" aria-labelledby="why-heading">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#A98542] uppercase">A calmer way to say “I do”</p>
          <h2 id="why-heading" className="mt-3 max-w-lg font-serif text-3xl leading-tight font-medium text-[#123D30] sm:text-4xl">All the right people, with room for what matters.</h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#6F8778]">Wedding planning should feel like your love story: considered, joyful, and yours. Weddora brings the details and the people behind them together, so you can spend less time searching and more time looking forward.</p>
          <Link href="/browse-services" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#123D30] px-6 text-sm font-semibold text-white transition hover:bg-[#1C5140]">See how it comes together <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative col-span-2 h-56 overflow-hidden rounded-3xl bg-[#E8DCCB] sm:h-72">
            <Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85" alt="A couple celebrating their wedding day together" fill sizes="(max-width: 1024px) 100vw, 50vw" unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#123D30]/60 to-transparent" />
            <p className="absolute bottom-5 left-5 font-serif text-xl text-white sm:bottom-7 sm:left-7 sm:text-2xl">Your story, your way.</p>
          </div>
          <div className="rounded-2xl bg-[#123D30] p-5 text-[#FAF8F2] sm:rounded-3xl sm:p-7">
            <Heart className="h-5 w-5 text-[#D6B771]" strokeWidth={1.7} />
            <h3 className="mt-5 font-serif text-xl">Made personal</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">Services and people for every kind of celebration.</p>
          </div>
          <div className="rounded-2xl bg-[#EDE5D6] p-5 text-[#123D30] sm:rounded-3xl sm:p-7">
            <Sparkles className="h-5 w-5 text-[#A98542]" strokeWidth={1.7} />
            <h3 className="mt-5 font-serif text-xl">Easy to explore</h3>
            <p className="mt-2 text-sm leading-6 text-[#6F8778]">Find inspiration and trusted vendors, all in one place.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#123D30] px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="text-xs font-bold tracking-[0.2em] text-[#D6B771] uppercase">Let the good part begin</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-medium text-[#FAF8F2] sm:text-4xl">Your day is one-of-a-kind. Your planning can be, too.</h2>
        <Link href="/browse-services" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#C6A15B] px-6 text-sm font-bold text-[#123D30] transition hover:bg-[#D8B96F]">Start exploring <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </main>
  )
}
