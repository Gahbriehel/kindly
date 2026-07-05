import { IoHeartOutline, IoGiftOutline } from "react-icons/io5";
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
        "bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-950/50",
      icon: PiCake,
      label: "Birthday",
    };
  }

  if (cat.includes("anniv")) {
    return {
      bgClass:
        "bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/50",
      icon: IoHeartOutline,
      label: "Anniversary",
    };
  }

  return {
    bgClass:
      "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700/50",
    icon: IoGiftOutline,
    label: category || "Event",
  };
}
