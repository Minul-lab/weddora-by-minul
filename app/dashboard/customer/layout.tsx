import { requireRole } from "@/lib/core/getsession"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    await requireRole("customer")
    return children;
}
