"use client";

import { JSX } from "react";
import { useTheme } from "@/src/context/ThemeContext";
import { BsCheckCircleFill, BsSun, BsMoonStars } from "react-icons/bs";

export function AppearanceForm(): JSX.Element {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Appearance Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Customize the visual theme of the application to match your preference
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 rounded-2xl bg-white dark:bg-slate-800/80 p-6 border border-gray-100 dark:border-slate-700/50">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`cursor-pointer relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
            theme === "light"
              ? "border-theme-primary bg-theme-primary/5 dark:bg-slate-700/30"
              : "border-gray-200 dark:border-slate-700"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-500 shadow-sm">
            <BsSun className="h-6 w-6" />
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Light Mode
            </span>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
              Clean and bright interface
            </p>
          </div>
          {theme === "light" && (
            <BsCheckCircleFill className="absolute top-3 right-3 h-5 w-5 text-theme-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`cursor-pointer relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
            theme === "dark"
              ? "border-theme-primary bg-theme-primary/5 dark:bg-slate-700/30"
              : "border-gray-200 dark:border-slate-700"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-500 shadow-sm">
            <BsMoonStars className="h-6 w-6" />
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
              Easier on the eyes in low light
            </p>
          </div>
          {theme === "dark" && (
            <BsCheckCircleFill className="absolute top-3 right-3 h-5 w-5 text-theme-primary" />
          )}
        </button>
      </div>
    </div>
  );
}
