"use client";

import type { JSX, ReactNode } from "react";
import { FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import { BaseButton } from "./Buttons";

interface FeatureBlockProps {
  title: string;
  description: string;
  icon?: ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function FeatureBlock({
  title,
  description,
  icon,
  ctaText = "Explore Plans",
  onCtaClick,
}: FeatureBlockProps): JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-slate-950/40 text-center flex flex-col items-center justify-center min-h-[400px] w-full">
      {/* Decorative background glow */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-theme-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Icon Badge */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-theme-primary/10 to-indigo-500/10 text-theme-primary">
        {icon || <FiShield className="h-10 w-10 text-theme-primary" />}
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700">
          <FiLock className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <BaseButton
          type="button"
          color="primary"
          className="px-8 font-semibold shadow-lg shadow-theme-primary/20"
          icon={<FiArrowRight />}
          position="icon-last"
          onClick={onCtaClick}
        >
          {ctaText}
        </BaseButton>
      </div>
    </div>
  );
}
