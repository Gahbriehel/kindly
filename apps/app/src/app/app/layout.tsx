"use client";

import "@/src/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../hooks/useAppSelector";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
