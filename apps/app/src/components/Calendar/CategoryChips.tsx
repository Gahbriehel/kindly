"use client";

import type { JSX } from "react";
import { clsx } from "clsx";
import { getCategoryDotClass } from "@/src/helpers/categoryConfig";
import type { ICategory } from "@/src/models/categories";

interface Props {
  categories: ICategory[];
  /** Selected category id; empty string means "All". */
  value: string;
  onChange: (categoryId: string) => void;
}

const chip =
  "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors";

/** Single-select category filter; scrolls sideways when it overflows. */
export function CategoryChips({
  categories,
  value,
  onChange,
}: Props): JSX.Element {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        type="button"
        onClick={() => onChange("")}
        aria-pressed={!value}
        className={clsx(
          chip,
          !value
            ? "bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        )}
      >
        All
      </button>
      {categories.map((category) => {
        const active = value === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(active ? "" : category.id)}
            aria-pressed={active}
            className={clsx(
              chip,
              active
                ? "bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            )}
          >
            <span
              className={clsx(
                "size-1.5 rounded-full",
                getCategoryDotClass(category.name),
              )}
            />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
