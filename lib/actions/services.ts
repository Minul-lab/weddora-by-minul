const BaserUrl = process.env.SERVER_DEFAULT_API || "http://localhost:8000"
export const CreateServices = async(data:FormData)=>{
    const res = await fetch(`${BaserUrl}/services `, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body:JSON.stringify(data),
    })
    if (!res.ok) {
    throw new Error("Failed to create service");
  }
    return  res.json()
}