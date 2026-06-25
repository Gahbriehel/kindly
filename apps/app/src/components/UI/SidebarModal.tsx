"use client";

import { useWindowDimension } from "@/src/hooks/useWindowDimension";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode, type JSX } from "react";
import { IoClose } from "react-icons/io5";
import { clsx } from "clsx";

export interface SidebarModalProps {
  children: ReactNode;
  title: string;
  display: boolean;
  close: () => void;
  className?: string;
  footer?: ReactNode;
}

export const SidebarModal = ({
  title,
  children,
  display,
  close,
  className,
  footer,
}: SidebarModalProps): JSX.Element => {
  const { width = 0 } = useWindowDimension();

  useEffect(() => {
    if (display) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [display]);

  // Adjust for the layout container's max-width if needed
  // The layout has max-w-[2400px] and mx-auto
  const layoutOffset = width > 2400 ? (width - 2400) / 2 : 0;

  return (
    <AnimatePresence>
      {display && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden print:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-gray-900/60 transition-all"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ marginRight: layoutOffset }}
            className={clsx(
              "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl dark:bg-slate-950 sm:max-w-xl",
              "border-l border-gray-100 dark:border-slate-800",
              className,
            )}
          >
            {/* Top brand accent bar */}
            <div className="h-1.5 w-full bg-theme-primary shrink-0" />

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-slate-800">
              <h2 className="font-manrope text-xl font-bold text-gray-900 dark:text-slate-100">
                {title}
              </h2>
              <button
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-theme-primary/10 hover:text-theme-primary dark:text-slate-400 dark:hover:bg-theme-primary/20 dark:hover:text-theme-primary transition-colors"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
              {children}
            </div>

            {footer && (
              <div className="!w-full flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
