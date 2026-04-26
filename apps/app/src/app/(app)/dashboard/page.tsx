"use client";
import { JSX } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export default function DashboardPage(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex h-full items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        Welcome {user?.firstName} {user?.lastName}
      </h1>
    </div>
  );
}
