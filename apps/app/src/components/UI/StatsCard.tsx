"use client";

import React, { ReactNode, JSX } from "react";
import { Skeleton } from "@/src/components/UI/Skeleton";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiTrendingUp, BiTrendingDown, BiMinus } from "react-icons/bi";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  tooltip?: string;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export function StatsCardContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex shrink-0 gap-4 sm:gap-6 overflow-x-auto -mx-1.5 -mt-2 px-1.5 pt-2 pb-4 scrollbar-hide ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  change,
  changeType,
  tooltip,
  isLoading = false,
  className = "",
  onClick,
}: StatsCardProps): JSX.Element {
  const [tooltipPos, setTooltipPos] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-theme-surface p-3.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col justify-between w-48 sm:w-52 shrink-0 h-20 ${className}`}
      >
        <div className="flex justify-between items-center">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-7 w-7 rounded-full shrink-0" />
        </div>
        <div className="flex justify-between items-end">
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
    );
  }

  const changeColors = {
    increase:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    decrease: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
    neutral: "text-gray-600 bg-gray-50 dark:bg-slate-800 dark:text-slate-400",
  };

  const changeIcons = {
    increase: BiTrendingUp,
    decrease: BiTrendingDown,
    neutral: BiMinus,
  };

  // Determine effective change type and value
  const effectiveChangeType =
    changeType || (trend ? (trend.isUp ? "increase" : "decrease") : "neutral");
  const ChangeIcon = changeIcons[effectiveChangeType];
  const displayChange =
    change !== undefined ? `${Math.abs(change)}%` : trend ? trend.value : null;

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative flex h-20 w-58 sm:w-60 shrink-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4 transition-all duration-300 hover:border-gray-200 dark:border-slate-800 dark:bg-theme-surface dark:hover:border-slate-700 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 truncate mr-2">
          {label}
        </h3>

        {icon && (
          <div className="p-1.5 bg-theme-primary/10 text-theme-primary rounded-full border-theme-primary-lightest/10 transition-colors duration-300 group-hover:bg-theme-primary-lighter shrink-0 flex items-center justify-center [&>*]:size-4">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="relative min-w-0 flex-1">
          <motion.h1
            onMouseEnter={(e) => {
              if (!tooltip) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ top: rect.bottom + 6, left: rect.left });
            }}
            onMouseLeave={() => setTooltipPos(null)}
            className={`relative truncate text-xl font-normal text-gray-900 dark:text-white tabular-nums ${
              tooltip ? "cursor-help" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.h1>

          {/* Portaled so the tooltip isn't clipped by the scrollable container */}
          {typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {tooltipPos && tooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    style={{ top: tooltipPos.top, left: tooltipPos.left }}
                    className="fixed z-50 w-auto min-w-[120px] rounded-lg bg-gray-900 dark:bg-slate-800 px-3 py-2 text-xs text-white border dark:border-slate-700 pointer-events-none whitespace-nowrap shadow-lg"
                  >
                    <div className="absolute -top-1 left-3 h-2 w-2 rotate-45 bg-gray-900 dark:bg-slate-800 border-l border-t dark:border-slate-700"></div>
                    <p className="text-center whitespace-nowrap">{tooltip}</p>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body,
            )}
        </div>

        {displayChange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 ml-2 ${changeColors[effectiveChangeType]}`}
          >
            <ChangeIcon size={12} />
            <span>{displayChange}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
