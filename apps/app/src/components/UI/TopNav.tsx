"use client";

import { memo, useEffect, useState, type JSX } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/src/helpers/navLinks";
import { useAppSelector } from "../../hooks/useAppSelector";
import { FiMenu } from "react-icons/fi";
import { capitalizeFirstLetter } from "@/src/helpers/capitalizeFirstLetter";
import Link from "next/link";

export const TopNav = memo(function TopNav({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}): JSX.Element {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const currentNav = navLinks.find((link) => pathname.startsWith(link.href));
  const title = currentNav?.title || "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-20 w-full shrink-0 items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-6 shadow-sm dark:shadow-slate-900/50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:hidden transition-colors"
          aria-label="Open Menu"
        >
          <FiMenu className="size-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {title}
        </h1>
      </div>

      <Link href="/profile">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:shadow-sm group cursor-pointer">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-primary/20 text-theme-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
            <p className="text-sm font-bold uppercase">
              {mounted && user?.firstName ? user.firstName.charAt(0) : "U"}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {mounted
                ? `${user?.firstName || ""} ${user?.lastName || ""}`
                : ""}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {mounted && user ? capitalizeFirstLetter(user.role) : ""}
            </p>
          </div>
        </div>
      </Link>
    </header>
  );
});
