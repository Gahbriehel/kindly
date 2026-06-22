"use client";

import { JSX, ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: DrawerProps): JSX.Element {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Panel Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between"
          >
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <FiX className="size-5" />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="flex-1 min-w-0">{children}</div>
            </div>

            {/* Drawer Footer Actions */}
            {footer && (
              <div className="!w-full flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800 shrink-0 mt-6">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
