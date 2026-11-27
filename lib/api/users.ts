import { headers } from "next/headers";
import { auth } from "../auth";


const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";


export const getUsers = async ()=> {
  const users = await auth.api.listUsers({
    query: {
         // The offset to start from.
        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
        // The operator to use for the filter.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
return users;
}   