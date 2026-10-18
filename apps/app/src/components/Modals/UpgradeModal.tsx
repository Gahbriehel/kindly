"use client";

import { useState, useEffect, useRef, useCallback, type JSX } from "react";
import {
  FiCheck,
  FiX,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { clsx } from "clsx";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { updateSubscriptionTier } from "@/src/store/slices/auth";
import { customToast } from "@/src/helpers/customToast";
import { BaseButton } from "../UI/Buttons";
import { SUBSCRIPTION_PLANS } from "@/src/data/subscriptions";

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
  const currentTier = user?.company?.subscriptionTier?.toUpperCase() || "BASIC";

  const plans = SUBSCRIPTION_PLANS;

  // Default to popular plan (PLATINUM) or current plan
  const defaultIndex = plans.findIndex((p) => p.name === "PLATINUM");
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(
    defaultIndex !== -1 ? defaultIndex : 1,
  );

  const carouselRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Center the selected plan on open for mobile
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (carouselRef.current) {
        const card = carouselRef.current.children[
          selectedPlanIndex
        ] as HTMLElement;
        if (card) {
          card.scrollIntoView({
            behavior: "instant",
            inline: "center",
            block: "nearest",
          });
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen, selectedPlanIndex]);

  const scrollToCard = useCallback((idx: number) => {
    setSelectedPlanIndex(idx);
    if (carouselRef.current) {
      const card = carouselRef.current.children[idx] as HTMLElement;
      if (card) {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const containerCenter =
      container.getBoundingClientRect().left + container.clientWidth / 2;

    let closestIdx = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const diff = Math.abs(containerCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setSelectedPlanIndex(closestIdx);
  }, []);

  const handleSelectPlan = (tier: string) => {
    dispatch(updateSubscriptionTier(tier));
    customToast.success(`Simulated upgrade to ${tier} active!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        className="relative w-full max-w-5xl my-auto bg-white dark:bg-theme-surface rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-left transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 sm:right-6 sm:top-6 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer z-20"
        >
          <FiX className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-theme-primary/10 text-theme-primary mb-2.5 sm:mb-3">
            <FiZap className="size-5 sm:size-6" />
          </div>
          <h2
            id="upgrade-modal-title"
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-100 font-geist"
          >
            Choose Your Plan
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 sm:mt-1.5 max-w-md mx-auto leading-relaxed">
            Upgrade your subscription to unlock premium features and manage your
            client relationships with team cooperation.
          </p>
        </div>

        {/* Mobile Plan Segmented Tabs (< md) */}
        <div className="md:hidden flex items-center p-1 bg-gray-100 dark:bg-slate-800/80 rounded-xl mb-3.5 gap-1">
          {plans.map((plan, idx) => {
            const isSelected = selectedPlanIndex === idx;
            const isCurrent = currentTier === plan.name;
            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={clsx(
                  "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer",
                  isSelected
                    ? "bg-white dark:bg-theme-surface text-gray-900 dark:text-white shadow-xs font-bold"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white",
                )}
              >
                <span>{plan.name}</span>
                {plan.popular && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-theme-primary/10 text-theme-primary font-bold">
                    ★
                  </span>
                )}
                {isCurrent && !plan.popular && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Plan Cards Container: Swipeable Carousel on Mobile, 3-Column Grid on md+ */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-2 px-2 pb-2 md:mx-0 md:px-0 md:pb-0 scroll-smooth items-stretch"
        >
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.name;
            return (
              <div
                key={plan.name}
                className={clsx(
                  "relative flex flex-col rounded-2xl border p-4 sm:p-5 md:p-6 transition-all duration-200",
                  "w-[85vw] max-w-[320px] sm:max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-none",
                  plan.color,
                )}
              >
                {/* Popular or Current Badge */}
                {plan.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-theme-primary to-indigo-500 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[0.625rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-xs whitespace-nowrap">
                    Most Popular
                  </span>
                ) : isCurrent ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-700 dark:bg-slate-700 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[0.625rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-xs whitespace-nowrap">
                    Current Plan
                  </span>
                ) : null}

                {/* Plan Info */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 font-geist">
                      {plan.name}
                    </h3>
                    {isCurrent && (
                      <span className="text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 min-h-[28px] sm:min-h-[32px] leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-100 font-geist">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xs text-gray-400 dark:text-slate-500 font-medium">
                      /month
                    </span>
                  </div>
                </div>

                <div className="my-3 sm:my-4 border-t border-gray-100 dark:border-slate-800/80" />

                {/* Features List */}
                <ul className="flex-1 space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 text-xs sm:text-[0.825rem]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                        <FiCheck className="size-3 sm:size-3.5" />
                      </div>
                      <span className="text-gray-700 dark:text-slate-300 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 opacity-45"
                    >
                      <div className="p-0.5 rounded-full bg-red-100/60 dark:bg-red-950/50 text-red-500 dark:text-red-400 mt-0.5 shrink-0">
                        <FiX className="size-3 sm:size-3.5" />
                      </div>
                      <span className="text-gray-400 dark:text-slate-500 line-through leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <BaseButton
                  type="button"
                  color={plan.buttonColor}
                  className="w-full font-semibold cursor-pointer py-2 sm:py-2.5 text-xs sm:text-sm"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : `Select ${plan.name}`}
                </BaseButton>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controls: Chevrons & Dots (< md) */}
        <div className="md:hidden flex items-center justify-between pt-2 px-1">
          <button
            type="button"
            onClick={() => scrollToCard(Math.max(0, selectedPlanIndex - 1))}
            disabled={selectedPlanIndex === 0}
            className="flex items-center justify-center h-7 w-7 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Previous plan"
          >
            <FiChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {plans.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={clsx(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  selectedPlanIndex === idx
                    ? "w-5 bg-theme-primary"
                    : "w-1.5 bg-gray-300 dark:bg-slate-700",
                )}
                aria-label={`Go to ${p.name} plan`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              scrollToCard(Math.min(plans.length - 1, selectedPlanIndex + 1))
            }
            disabled={selectedPlanIndex === plans.length - 1}
            className="flex items-center justify-center h-7 w-7 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Next plan"
          >
            <FiChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
