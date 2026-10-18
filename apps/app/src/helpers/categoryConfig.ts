import {
  IoHeartOutline,
  IoGiftOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { PiCake } from "react-icons/pi";
import type { IconType } from "react-icons";

export interface CategoryConfig {
  bgClass: string;
  icon: IconType;
  label: string;
}

/**
 * Resolves the display config (icon, label, background classes) for a given
 * event category string. Falls back to a generic "Event" config.
 */
export function getCategoryConfig(category: string): CategoryConfig {
  const cat = (category || "").toLowerCase();

  if (cat.includes("birth")) {
    return {
      bgClass:
        "bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/40",
      icon: PiCake,
      label: "Birthday",
    };
  }

  if (cat.includes("anniv")) {
    return {
      bgClass:
        "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40",
      icon: IoHeartOutline,
      label: "Anniversary",
    };
  }

  if (cat.includes("wedding")) {
    return {
      bgClass:
        "bg-pink-50 text-pink-600 border border-pink-100 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800/40",
      icon: IoSparklesOutline,
      label: "Wedding",
    };
  }

  return {
    bgClass:
      "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: IoGiftOutline,
    label: category || "Event",
  };
}

const CUSTOM_DOTS = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-400",
  "bg-lime-500",
];

/**
 * Dot colour for a category. System categories have fixed colours; custom ones
 * get a stable colour hashed from their name so it never changes between loads.
 */
export function getCategoryDotClass(category: string | undefined): string {
  const cat = (category || "").toLowerCase();
  if (cat.includes("birth")) return "bg-indigo-500";
  if (cat.includes("work")) return "bg-orange-500";
  if (cat.includes("anniv")) return "bg-red-500";
  if (cat.includes("wedding")) return "bg-pink-500";
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = (hash * 31 + cat.charCodeAt(i)) >>> 0;
  }
  return CUSTOM_DOTS[hash % CUSTOM_DOTS.length];
}
