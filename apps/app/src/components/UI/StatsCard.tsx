"use client";

import React, { ReactNode, JSX } from "react";
import { Skeleton } from "@/src/components/UI/Skeleton";
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
      className={`flex shrink-0 gap-6 overflow-x-auto pb-4 scrollbar-hide ${className}`}
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
}: StatsCardProps): JSX.Element {
  const [showTooltip, setShowTooltip] = React.useState(false);

  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 min-w-[240px] w-64 shrink-0 h-36 ${className}`}
      >
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex flex-col gap-1 mt-auto">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
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
      className={`group relative flex h-28 w-80 shrink-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${className}`}
      whileHover={{
        scale: 1.02,
        y: 4,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            {label}
          </h3>
          <div className="relative">
            <motion.h1
              onMouseEnter={() => tooltip && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`relative truncate text-2xl font-normal text-gray-900 dark:text-white tabular-nums ${
                tooltip ? "cursor-help" : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </motion.h1>

            <AnimatePresence>
              {showTooltip && tooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-10 z-20 w-auto min-w-[120px] rounded-lg bg-gray-900 dark:bg-slate-800 px-3 py-2 text-xs text-white shadow-lg border dark:border-slate-700 pointer-events-none"
                >
                  <div className="absolute -top-1 left-3 h-2 w-2 rotate-45 bg-gray-900 dark:bg-slate-800 border-l border-t dark:border-slate-700"></div>
                  <p className="text-center whitespace-nowrap">{tooltip}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {icon && (
          <div className="p-4.5 bg-theme-primary/10  text-theme-primary  rounded-full border-theme-primary-lightest/10 transition-colors duration-300 group-hover:bg-theme-primary-lighter ">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        {displayChange ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${changeColors[effectiveChangeType]}`}
          >
            <ChangeIcon size={14} />
            <span>{displayChange}</span>
            {!change && (
              <span className="opacity-60 font-normal ml-0.5">
                vs last month
              </span>
            )}
          </motion.div>
        ) : (
          <div className="h-6" /> // spacer
        )}
      </div>
    </motion.div>
  );
}
