const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";

  export const getPremiumUserById = async(userId:string)=>{
    const res = await fetch(`${BaseUrl}/users/${userId}/premium`)
    return res.json()
}