import AdminUsersTable from "./users-table"
import { getUsers } from "@/lib/api/users"

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof getUsers>>["users"] = []
  let total = 0
  let error = ""

  try {
    const result = await getUsers()
    users = result.users
    total = result.total
  } catch {
    error = "We couldn’t load users. Make sure you’re signed in as an admin and try again."
  }

  return <AdminUsersTable users={users} total={total} error={error} />
}
