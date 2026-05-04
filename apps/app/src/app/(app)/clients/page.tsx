"use client";

import { FiPlus } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import type { JSX } from "react";

export default function ClientsPage(): JSX.Element {
  // const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 dark:text-slate-100">
            Clients
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your client relationships
          </p>
        </div>
        <BaseButton
          type="button"
          onClick={() => {}}
          color="primary"
          icon={<FiPlus className="size-4" />}
          position="icon-first"
          className="w-full sm:w-auto"
          text="Add Client"
        />
      </div>
    </div>
  );
}
