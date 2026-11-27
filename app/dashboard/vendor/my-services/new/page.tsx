"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

import { Label, Input } from "@/components/ui/form"


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CreateServices } from "@/lib/actions/services"
import type { ServiceFormValues } from "@/types"
import { getServiceCount } from "@/lib/api/services"
import { getPremiumUserById } from "@/lib/actions/userPremium"

// Validation schema

const serviceSchema = yup.object({
  serviceName: yup
    .string()
    .required("Service name is required")
    .min(2, "Service name must be at least 2 characters"),

  category: yup.string().required("Category is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be a positive number"),

  location: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters"),

  image: yup
    .string()
    .required("Image URL is required")
    .url("Please enter a valid image URL"),
})

export default function AddServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: yupResolver(serviceSchema),

    defaultValues: {
      serviceName: "",
      category: "",
      description: "",
      price: 0,
      location: "",
      image: "",
    },
  })

  const onSubmit = async (data: ServiceFormValues) => {
    setSubmitError("")

    if (!session?.user) {
      setSubmitError("You must be signed in as a vendor to publish a service.")
      return
    }

    try {
      setIsSubmitting(true)

      // Check how many services this vendor already has
      const serviceCount = await getServiceCount(session.user.id)
      const  IsPremium = await getPremiumUserById(session.user.id)
      console.log(IsPremium)

      // Free vendors can have at most three services; Premium vendors are unlimited.
      if (!IsPremium.premium && serviceCount >= 3) {
        router.push("/dashboard/vendor/subscription")
        return
      }

      // Otherwise, create the service
      const result = await CreateServices({
        ...data,
        vendorId: session.user.id,
        vendorEmail: session.user.email,
        vendorName: session.user.name,
      })

      console.log("Service Data:", result)
      if(result.insertedId){
      router.push("/dashboard/vendor/my-services")

      }

      router.refresh()
    } catch (error) {
      console.error("Error creating service:", error)
      setSubmitError("Unable to publish the service. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-[#FAF8F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8 lg:p-10">
          <h2 className="mb-4 text-2xl font-bold text-[#123D30]">
            Add New Service
          </h2>

          <p className="mb-6 text-[#6F8778]">
            Fill in the details below to publish your wedding service
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Name */}
            <div>
              <Label
                htmlFor="serviceName"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Service Name
              </Label>

              <Input
                id="serviceName"
                {...register("serviceName")}
                placeholder="e.g., Photography & Videography"
                className="w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] transition placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />

              {errors.serviceName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serviceName.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Category
              </Label>

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      className="w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29]"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Photography & Videography">
                        Photography & Videography
                      </SelectItem>

                      <SelectItem value="Wedding Venues">
                        Wedding Venues
                      </SelectItem>

                      <SelectItem value="Decoration & Florist">
                        Decoration & Florist
                      </SelectItem>

                      <SelectItem value="Catering Services">
                        Catering Services
                      </SelectItem>

                      <SelectItem value="Makeup & Styling">
                        Makeup & Styling
                      </SelectItem>

                      <SelectItem value="Wedding Fashion">
                        Wedding Fashion
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Description
              </Label>

              <textarea
                id="description"
                {...register("description")}
                placeholder="Describe your service..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] transition placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Price (USD)
              </Label>

              <Input
                id="price"
                type="number"
                step="any"
                {...register("price", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] transition placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Location
              </Label>

              <Input
                id="location"
                {...register("location")}
                placeholder="e.g., New York, USA"
                className="w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] transition placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />

              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <Label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-[#123D30]"
              >
                Service Image URL
              </Label>

              <Input
                id="image"
                {...register("image")}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-2xl border border-[#E5DED2] bg-[#FAF8F2] px-4 py-3 text-[15px] text-[#302D29] transition placeholder:text-[#A9A29A] focus:border-[#123D30] focus:bg-white focus:ring-2 focus:ring-[#123D30]/10"
              />

              {errors.image && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.image.message}
                </p>
              )}

              <p className="mt-2 text-sm text-[#6F8778]">
                For now, enter the image URL manually. Image upload via ImgBB
                will be enabled later.
              </p>
            </div>

            {submitError && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            {/* Submit */}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting || isSessionPending}
                className="w-full rounded-2xl bg-[#123D30] px-4 py-3 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#1C5140] focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {isSubmitting ? "Creating Service..." : "Publish Service"}
              </Button>
            </div>
          </form>

          {/* Cancel */}
          <div className="mt-6 flex gap-3 border-t border-[#E5DED2] pt-6">
            <Link
              href="/dashboard/vendor/my-services"
              className="flex-1 rounded-2xl border border-[#123D30] px-4 py-3 text-center text-sm font-medium text-[#123D30] transition-colors hover:bg-[#E8DCCB] focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
