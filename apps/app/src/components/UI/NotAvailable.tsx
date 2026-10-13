import type { JSX } from "react";

export function NotAvailable({
  message = "Not available",
}: {
  message?: string;
}): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.7rem] font-medium italic text-gray-400 dark:text-slate-500 select-none">
      {message}
    </span>
  );
}
