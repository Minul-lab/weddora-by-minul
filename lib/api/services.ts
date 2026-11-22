const BaserUrl = process.env.SERVER_DEFAULT_API || "http://localhost:8000"

export const  getServices =async ()=>{
    const res =await fetch(`${BaserUrl}/services`)
    const data = res.json()
    return data;
}