import { headers } from "next/headers";
import { auth } from "../auth";





export const getUsers = async ()=> {
  const requestHeaders = await headers()
  const pageSize = 100
  let offset = 0
  let total = 0
  const users = []

  do {
    const page = await auth.api.listUsers({
      query: {
        limit: pageSize,
        offset,
        sortBy: "name",
        sortDirection: "asc",
      },
      headers: requestHeaders,
    })

    users.push(...page.users)
    total = page.total
    offset = users.length

    if (page.users.length === 0) break
  } while (offset < total)

  return { users, total }
}
