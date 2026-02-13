// app/(app)/layout.tsx
import { redirect } from "next/navigation";
import "@/src/styles/globals.css";
// import { getServerSession } from "next-auth"; // or your auth helper
// import Sidebar from "@/components/dashboard/Sidebar";
// import Header from "@/components/dashboard/Header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const session = await getServerSession(); // or your Prisma/session check

  //   if (!session?.user) {
  //     redirect("/auth/login?from=" + encodeURIComponent("/dashboard"));
  //   }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* <Sidebar /> */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* <Header /> */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}