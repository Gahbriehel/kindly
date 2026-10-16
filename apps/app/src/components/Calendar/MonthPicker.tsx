"use client";

import { useState, type JSX } from "react";
import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { clsx } from "clsx";
import type { DateKey } from "@/src/helpers/calendarHelpers";

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format("MMM"),
);

interface Props {
  /** Any day of the month being viewed. */
  month: DateKey;
  onChange: (month: DateKey) => void;
}

/** Month label that opens a month/year jump picker. */
export function MonthPicker({ month, onChange }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const current = dayjs(month);
  const [year, setYear] = useState(current.year());

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setYear(current.year());
        setOpen(next);
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-1 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-slate-800 md:text-lg"
          aria-label="Choose month and year"
        >
          {current.format("MMMM YYYY")}
          <FiChevronDown
            className={clsx(
              "size-4 text-gray-400 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className="z-30 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-theme-surface"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Previous year"
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Next year"
            >
              <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((label, index) => {
              const active =
                year === current.year() && index === current.month();
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onChange(
                      dayjs()
                        .year(year)
                        .month(index)
                        .date(1)
                        .format("YYYY-MM-DD"),
                    );
                    setOpen(false);
                  }}
                  className={clsx(
                    "cursor-pointer rounded-xl py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-theme-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
