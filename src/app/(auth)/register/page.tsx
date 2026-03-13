"use client";

import Link from "next/link";
import { BaseButton } from "../../(marketing)/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 w-full mx-auto">
      <h2 className="text-3xl font-serif text-[#3D3530] dark:text-white mb-8">
        Start remembering better
      </h2>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-[#3D3530] dark:text-gray-200"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF9B7A]/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

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

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#3D3530] dark:text-gray-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF9B7A]/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <BaseButton
          type="button"
          color="primary"
          text="Create account"
          className="w-full mt-4 !h-12 !rounded-lg"
        />
      </form>

      <div className="mt-6 flex flex-col gap-4 text-center">
        <p className="text-xs text-[#5A534D] dark:text-gray-400">
          Free 14-day trial. No credit card required.
        </p>
        <p className="text-sm text-[#5A534D] dark:text-gray-400 mt-2">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#FF9B7A] hover:text-[#FF8765] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
