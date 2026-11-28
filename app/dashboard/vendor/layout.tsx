import { requireRole } from "@/lib/core/getsession"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    await requireRole("vendor")
  return children;
}
