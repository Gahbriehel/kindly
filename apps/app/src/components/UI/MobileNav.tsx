"use client";

import { memo, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { navLinks } from "@/src/helpers/navLinks";
import { IoClose } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

export const MobileNav = memo(function MobileNav({
  isOpen,
  onClose,
  onLogoutClick,
}: MobileNavProps): JSX.Element {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm sm:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[280px] flex-col bg-white dark:bg-slate-950 shadow-2xl sm:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800">
              <Logo size="full" svgClassName="h-10 w-auto" />
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close Menu"
              >
                <IoClose size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200",
                          isActive
                            ? "bg-theme-primary/10 text-theme-primary font-semibold shadow-sm"
                            : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-theme-primary dark:hover:text-theme-primary",
                        )}
                      >
                        <div
                          className={clsx(
                            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                            isActive
                              ? "text-theme-primary"
                              : "text-gray-400 dark:text-slate-500",
                          )}
                        >
                          {link.icon}
                        </div>
                        <span className="text-base">{link.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-gray-100 dark:border-slate-800 p-6 space-y-4">
              <button
                onClick={onLogoutClick}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                  <MdOutlineLogout size={20} />
                </div>
                <span className="text-base font-semibold">Logout</span>
              </button>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 text-center">
                Powered by Oneflare
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
