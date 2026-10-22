"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
  type JSX,
} from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { clsx } from "clsx";

const emptySubscribe = () => () => {};

export interface CenterModalProps {
  children: ReactNode;
  title?: ReactNode;
  header?: ReactNode;
  display?: boolean;
  isOpen?: boolean;
  close?: () => void;
  onClose?: () => void;
  className?: string;
  maxWidth?: string;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
}

export const CenterModal = ({
  title,
  header,
  children,
  display,
  isOpen,
  close,
  onClose,
  className,
  maxWidth = "max-w-lg",
  footer,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabel,
}: CenterModalProps): JSX.Element | null => {
  const isVisible = display ?? isOpen ?? false;
  const handleClose = useCallback(() => {
    if (close) {
      close();
    } else if (onClose) {
      onClose();
    }
  }, [close, onClose]);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Lock body scroll while open
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Handle Escape key
  useEffect(() => {
    if (!isVisible || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, closeOnEscape, handleClose]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : ariaLabel}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6 print:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? handleClose : undefined}
            className="fixed inset-0 bg-gray-950/60 dark:bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Center Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className={clsx(
              "relative z-10 w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl dark:bg-theme-surface border border-gray-100 dark:border-slate-800 my-auto",
              maxWidth,
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom Header if provided */}
            {header ? (
              header
            ) : title ? (
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4.5 dark:border-slate-800">
                {typeof title === "string" ? (
                  <h2 className="font-manrope text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100">
                    {title}
                  </h2>
                ) : (
                  <div className="min-w-0 flex-1">{title}</div>
                )}
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    type="button"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close modal"
                  >
                    <IoClose size={22} />
                  </button>
                )}
              </div>
            ) : null}

            {/* Modal Body */}
            <div>{children}</div>

            {/* Footer if provided */}
            {footer && (
              <div className="border-t border-gray-100 px-6 py-4 dark:border-slate-800">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
