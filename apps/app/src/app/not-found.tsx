import { BaseButton } from "@/src/components/UI/Buttons";
import Link from "next/link";
import type { JSX } from "react";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center relative overflow-hidden text-[#3D3530] dark:text-gray-100 bg-white dark:bg-gray-900">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/login">
        <BaseButton text="Back to Login" color="primary" />
      </Link>
    </div>
  );
}
