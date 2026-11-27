import type { ApplicationPayload } from "@/types";

const BaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.SERVER_DEFAULT_API ||
  "http://localhost:8000";

export const CreateApplication = async (data: ApplicationPayload) => {
  const res = await fetch(`${BaseUrl}/applications`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.message || "Failed to create application");
  }

  return result;
};

export const getApplicationsByUserId = async (userId: string) => {
  const res = await fetch(`${BaseUrl}/applications/user/${userId}`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
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
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  return res.json();
};

export type ApplicationDecision = "accepted" | "rejected";

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationDecision
) => {
  const res = await fetch(`${BaseUrl}/applications/${applicationId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.message || "Failed to update booking request");
  }

  return result;
};
