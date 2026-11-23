import type { ApplicationPayload } from "@/types";

const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";

export const CreateApplication = async (data: ApplicationPayload) => {
  const res = await fetch(`${BaseUrl}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create application");
  }

  return res.json();
};

export const getApplicationsByUserId = async (userId: string) => {
  const res = await fetch(`${BaseUrl}/applications/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  return res.json();
};
export const getApplicationsByVendorId = async (vendorID: string) => {
  const res = await fetch(`${BaseUrl}/applications/vendor/${vendorID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  return res.json();
};
