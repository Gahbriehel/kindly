import type { JSX } from "react";

export function NotAvailable(): JSX.Element {
  return (
    <span className="text-gray-400 italic font-light italic text-xs">N/A</span>
  );
}
