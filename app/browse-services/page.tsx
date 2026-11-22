"use client"

import { useSearchParams } from "next/navigation"

const BrowsePage = () => {
     const searchParams = useSearchParams()

     const search = searchParams.get("search")
  return <div>
    <p>search: {search}</p>
  </div>
}

export default BrowsePage
