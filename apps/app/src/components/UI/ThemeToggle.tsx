"use client";

import { useTheme } from "@/src/context/ThemeContext";
import { BsSun, BsMoonStars } from "react-icons/bs";
import { type JSX, useEffect, useState } from "react";

export function ThemeToggle(): JSX.Element | null {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/80 text-gray-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-900/60 hover:scale-105 shadow-md focus:outline-none"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <BsMoonStars className="h-5 w-5 text-indigo-500 dark:text-indigo-300" />
      ) : (
        <BsSun className="h-5 w-5 text-amber-500 dark:text-amber-300" />
      )}
    </button>
  );
}
