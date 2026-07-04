"use client";

import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { updateSubscriptionTier } from "@/src/store/slices/auth";
import { customToast } from "@/src/helpers/customToast";
import { BaseButton } from "../UI/Buttons";
import { FiCheck, FiX, FiZap } from "react-icons/fi";
import type { JSX } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
}: UpgradeModalProps): JSX.Element | null {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentTier = user?.subscriptionTier?.toUpperCase() || "BASIC";

  if (!isOpen) return null;

  const handleSelectPlan = (tier: string) => {
    dispatch(updateSubscriptionTier(tier));
    customToast.success(`Simulated upgrade to ${tier} active!`);
    onClose();
  };

  const plans = [
    {
      name: "BASIC",
      price: "$0",
      description: "Ideal for individual creators getting started.",
      features: [
        "Up to 5 clients",
        "Personal template library",
        "Individual dashboard access",
      ],
      notIncluded: [
        "Staff & team collaboration",
        "Company account creation",
        "Unlimited client management",
      ],
      color: "border-gray-200 dark:border-slate-800",
      buttonColor: "outline" as const,
    },
    {
      name: "PREMIUM",
      price: "$19",
      description: "Perfect for growing professionals.",
      features: [
        "More than 5 clients (Unlimited)",
        "Personal template library",
        "Individual dashboard access",
        "Priority email support",
      ],
      notIncluded: ["Staff & team collaboration", "Company account creation"],
      color: "border-gray-200 dark:border-slate-800",
      buttonColor: "primary" as const,
    },
    {
      name: "PLATINUM",
      price: "$40",
      description: "Ultimate power for teams and enterprises.",
      features: [
        "Unlimited clients",
        "Staff & team collaboration",
        "Create or switch to a company account",
        "Dedicated account manager",
        "Early access to new features",
      ],
      notIncluded: [],
      color:
        "border-theme-primary ring-2 ring-theme-primary/30 bg-theme-primary/5 dark:bg-theme-primary/10",
      buttonColor: "gradient" as const,
      popular: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-2xl w-full max-w-5xl p-6 md:p-10 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <FiX className="size-5" />
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary mb-4">
            <FiZap className="size-6" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 dark:text-slate-100">
            Choose Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Upgrade your subscription to unlock premium features and manage your
            client relationships with team cooperation.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.name;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-6 md:p-8 transition-all duration-200 ${plan.color}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-theme-primary to-indigo-500 px-4 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 dark:text-slate-500 min-h-[32px]">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-serif font-bold text-gray-900 dark:text-slate-100">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xs text-gray-400 dark:text-slate-500 font-medium">
                      /month
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-100 dark:border-slate-800/80" />

                {/* Features List */}
                <ul className="flex-1 space-y-3.5 mb-8 text-[0.8rem]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <FiCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 opacity-40"
                    >
                      <FiX className="size-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-400 dark:text-slate-500 line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <BaseButton
                  type="button"
                  color={plan.buttonColor}
                  className="w-full font-semibold cursor-pointer"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : `Select ${plan.name}`}
                </BaseButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
