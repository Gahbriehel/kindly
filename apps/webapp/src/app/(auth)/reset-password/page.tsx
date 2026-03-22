"use client";

import Link from "next/link";
import { BaseButton } from "../../(marketing)/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 w-full mx-auto">
      <h2 className="text-3xl font-serif text-[#3D3530] dark:text-white mb-8">
        Reset your password
      </h2>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#3D3530] dark:text-gray-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF9B7A]/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <BaseButton
          type="button"
          color="primary"
          text="Send reset link"
          className="w-full mt-2 !h-12 !rounded-lg"
        />
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-[#FF9B7A] hover:text-[#FF8765] transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
