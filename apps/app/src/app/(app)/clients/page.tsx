"use client";

import { useState, type JSX } from "react";
import { FiPlus, FiInfo, FiZap } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { UpgradeModal } from "@/src/components/Modals/UpgradeModal";

export default function ClientsPage(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const tier = user?.subscriptionTier?.toUpperCase() || "BASIC";
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Client Limit Banners */}
      {tier === "BASIC" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
          <div className="flex items-start gap-3">
            <FiInfo className="size-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold">Basic Plan Limits</p>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/80 mt-0.5">
                You are limited to a maximum of 5 clients on the Basic tier.
                Upgrade to Premium or Platinum for unlimited client capacity.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <FiZap className="size-3.5" />
            Upgrade Plan
          </button>
        </div>
      )}

      {tier === "PREMIUM" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 dark:border-slate-800 dark:bg-slate-900/40 text-indigo-900 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <FiZap className="size-5 shrink-0 mt-0.5 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold">Premium Plan Status</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                You have unlimited client capacity! Upgrade to Platinum to
                create a Company Account, manage staff, and collaborate.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-theme-primary hover:bg-theme-primary-hover text-white px-4 py-2 rounded-xl transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            Upgrade to Platinum
          </button>
        </div>
      )}

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

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
