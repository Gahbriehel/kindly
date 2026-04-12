"use client";
import { useAppSelector } from "./hooks/useAppSelector";

export default function RootPage() {
  const user = useAppSelector((state) => state.auth.user);
  console.log("user:", user);
  // redirect("/login");
  return (
    <div>
      <h1>Root Page</h1>
    </div>
  );
}
