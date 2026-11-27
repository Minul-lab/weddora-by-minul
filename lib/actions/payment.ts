const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";
export const checkOutVerify = async (sessionId: string) => {
  const res = await fetch(`${BaseUrl}/payments/checkout-verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });
  return res.json();
};
