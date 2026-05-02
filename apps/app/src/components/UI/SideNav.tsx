"use client";
import { useState, useMemo, useCallback, memo, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
// import { logout } from "@/services/auth";
// import { logOut } from "@/store/slices/auth";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import Link from "next/link";
import { MdOutlineLogout } from "react-icons/md";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { navLinks } from "../../helpers/navLinks";
import { queryClient } from "../../utils/Providers";

import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";

const MiniLogo = memo(() => (
  <motion.div
    key="mini-logo"
    initial={{ opacity: 0, scale: 0.8, x: -20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.8, x: -20 }}
    transition={{ duration: 0.1, ease: "easeInOut" }}
    className="flex h-full w-full items-center justify-center pt-4"
  >
    <Logo size="small" svgClassName="h-8 w-8 mx-auto" />
  </motion.div>
));
MiniLogo.displayName = "MiniLogo";

const FullLogo = memo(() => (
  <motion.div
    key="full-logo"
    initial={{ opacity: 0, scale: 0.8, x: 20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.8, x: 20 }}
    transition={{ duration: 0.1, ease: "easeInOut" }}
  >
    <Logo size="full" svgClassName="h-20 scale-[2] mx-auto" />
  </motion.div>
));
FullLogo.displayName = "FullLogo";

const ExpandIcon = memo(() => (
  <motion.div
    key="expand-icon"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.1, ease: "easeInOut" }}
    className="flex h-full w-full items-center justify-center pt-4"
  >
    <TbLayoutSidebarRightCollapse className="size-6 text-theme-primary" />
  </motion.div>
));
ExpandIcon.displayName = "ExpandIcon";

interface NavItemProps {
  icon: JSX.Element;
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
}: NavItemProps): JSX.Element | null {
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
}): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logOutModalDisplay, setLogOutModalDisplay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = useCallback(async () => {
    // try {
    //   await logout();
    // } catch {
    //   // proceed with local logout even if the API call fails
    // }
    // dispatch(logOut());
    queryClient.clear();
    router.push("/login");
  }, [dispatch, router]);

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

  const navigationLinks = useMemo(() => [...navLinks], []);

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
                  <ExpandIcon key="expand-icon" />
                ) : (
                  <MiniLogo key="mini-logo" />
                )
              ) : (
                <FullLogo key="full-logo" />
              )}
            </AnimatePresence>
          </div>

          {!collapsed && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="ml-2 cursor-pointer text-theme-primary hover:text-theme-primary-hover transition-colors"
            >
              <TbLayoutSidebarLeftCollapse className="size-6" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden py-4">
          <ul className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
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
                  Powered by Oneflare
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
      />
    </>
  );
}
