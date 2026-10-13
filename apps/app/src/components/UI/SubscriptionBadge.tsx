"use client";
import { useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import { UpgradeModal } from "../Modals/UpgradeModal";
import { useAppSelector } from "@/src/hooks/useAppSelector";

export function SubscriptionBadge({
  collapsed,
}: {
  collapsed: boolean;
}): React.ReactElement | null {
  const user = useAppSelector((state) => state.auth.user);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const clientLimit = user?.client_limit;

  if (
    collapsed ||
    isDismissed ||
    user?.company?.subscriptionTier?.toUpperCase() === "PLATINUM"
  ) {
    return null;
  }

  return (
    <>
      <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl bg-[#161D49] p-4 text-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="size-3.5" />
        </button>

        <p className="mb-3 mt-6 text-[12px] font-normal leading-[18px] text-white">
          Upgrade to premium and enjoy unlimited clients, staff seats & shared
          templates.
        </p>

        {clientLimit && (
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-[10px] font-normal leading-[15px] text-[#FFFFFF8C]">
              <span>
                {clientLimit.used} / {clientLimit.max} clients used
              </span>
              <span>{Math.round(clientLimit.percentage)}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#2B43AE]"
                style={{
                  width: `${Math.min(100, Math.max(0, clientLimit.percentage))}%`,
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setUpgradeModalOpen(true);
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-semibold text-[#161D49] transition-all hover:bg-white/90 active:scale-98"
        >
          Upgrade now
          <FiArrowRight className="size-4" />
        </button>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </>
  );
}
