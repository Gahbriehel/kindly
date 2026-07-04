"use client";
import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import Link from "next/link";
import { MdOutlineLogout } from "react-icons/md";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import { FiZap, FiX } from "react-icons/fi";
import { getNavLinks } from "../../helpers/navLinks";
import { useLogoutMutation } from "../../hooks/useAuthQuery";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { UpgradeModal } from "../Modals/UpgradeModal";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { UserRole } from "@/src/models/auth";

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  collapsed: boolean;
  isActive: boolean;
  // When collapsed, clicks on nav items should expand instead of navigate
  onCollapsedClick?: (e: React.MouseEvent) => void;
}

function NavItem({
  icon,
  title,
  href,
  collapsed,
  isActive,
  onCollapsedClick,
}: NavItemProps): React.ReactElement {
  return (
    <li>
      <Link
        href={collapsed ? "#" : href}
        onClick={collapsed ? onCollapsedClick : undefined}
        className={clsx(
          "group relative flex items-center transition-colors duration-200",
          "h-12 px-7 text-md mr-2",
          collapsed ? "cursor-e-resize justify-center" : "cursor-pointer",
          isActive
            ? "bg-theme-primary/15 text-gray-700 rounded-xl"
            : "text-gray-600 hover:text-gray-500",
        )}
      >
        <div
          className={clsx(
            "flex shrink-0 items-center justify-center transition-transform group-hover:scale-110",
            isActive ? "text-theme-primary" : "text-gray-500",
            !collapsed && "mr-4",
          )}
        >
          {icon}
        </div>
        {!collapsed && <span className="truncate">{title}</span>}
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-0 h-full w-1 bg-theme-primary"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </li>
  );
}

export function SideNav({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}): React.ReactElement {
  const pathname = usePathname();
  const [logOutModalDisplay, setLogOutModalDisplay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isUpgradeDismissed, setIsUpgradeDismissed] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const filteredNavLinks = useMemo(
    () => getNavLinks(user?.role as UserRole),
    [user?.role],
  );

  const { mutate: logoutMutation, isPending } = useLogoutMutation();

  const handleLogout = useCallback(() => {
    logoutMutation();
  }, [logoutMutation]);

  const openLogoutModal = useCallback(() => setLogOutModalDisplay(true), []);
  const closeLogoutModal = useCallback(() => setLogOutModalDisplay(false), []);

  // Intercept clicks on the collapsed sidebar to expand instead
  const handleCollapsedClick = useCallback(
    (e: React.MouseEvent) => {
      if (collapsed) {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }
    },
    [collapsed, onToggle],
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        onClick={collapsed ? onToggle : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          "relative isolate z-20 flex h-screen shrink-0 flex-col border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-colors duration-200",
          collapsed && "cursor-e-resize",
        )}
      >
        <div className="relative flex h-20 shrink-0 items-center px-4">
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {collapsed ? (
                isHovered ? (
                  <motion.div
                    key="expand-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="flex w-full items-center justify-center"
                  >
                    <TbLayoutSidebarRightCollapse className="size-6 text-theme-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mini-logo"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="flex w-full items-center justify-center"
                  >
                    <Logo size="small" iconOnly className="mx-auto" />
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="full-logo"
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Logo size="medium" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!collapsed && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="ml-2 cursor-pointer text-gray-500 hover:text-theme-primary-hover transition-colors"
            >
              <TbLayoutSidebarLeftCollapse className="size-6" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden py-4">
          <ul className="flex flex-col gap-1">
            {filteredNavLinks.map((link) => (
              <NavItem
                key={link.title}
                icon={link.icon}
                title={link.title}
                href={link.href}
                collapsed={collapsed}
                isActive={pathname === link.href}
                onCollapsedClick={handleCollapsedClick}
              />
            ))}
          </ul>
        </div>

        {/* Upgrade CTA */}
        {!collapsed &&
          user?.subscriptionTier?.toUpperCase() !== "PLATINUM" &&
          !isUpgradeDismissed && (
            <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-4 text-white shadow-lg shadow-black/20">
              {/* Subtle ambient glow, brand-colored not purple/amber */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUpgradeDismissed(true);
                }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="size-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-sm">
                  <FiZap className="size-4 shrink-0" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Upgrade to Platinum
                </span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-indigo-300 uppercase shrink-0">
                  20% off
                </span>
              </div>

              <p className="text-[0.75rem] leading-snug text-white/60 mb-3 font-medium">
                {user?.subscriptionTier?.toUpperCase() === "PREMIUM"
                  ? "Unlock company accounts, staff management, and unlimited clients."
                  : "Unlock more clients, staff collaboration, and organization features."}
              </p>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-bold">$40</span>
                <span className="text-[0.65rem] text-white/50 font-medium">
                  /month
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUpgradeModalOpen(true);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-2 text-xs font-bold text-white shadow-md hover:from-indigo-400 hover:to-blue-400 active:scale-98 transition-all cursor-pointer text-center"
              >
                Upgrade now
              </button>
            </div>
          )}

        {/* Footer / Logout */}
        <div className="mt-auto shrink-0 border-t border-gray-200 dark:border-slate-800 p-3">
          <button
            onClick={(e) => {
              if (collapsed) return;
              e.stopPropagation();
              openLogoutModal();
            }}
            className={clsx(
              "mt-2 flex w-full items-center rounded-lg p-2 text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20",
              collapsed
                ? "justify-center cursor-e-resize"
                : "px-3 cursor-pointer",
            )}
          >
            <MdOutlineLogout className="size-4 shrink-0" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>

          <div className="mt-2 h-4 overflow-hidden text-center">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500"
                >
                  Kindly
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <ConfirmActionModal
        actionName="Logout"
        display={logOutModalDisplay}
        close={closeLogoutModal}
        fn={handleLogout}
        loading={isPending}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </>
  );
}
