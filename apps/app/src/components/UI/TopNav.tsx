"use client";

import { memo, useEffect, useState, useRef, type JSX } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/src/helpers/navLinks";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setAccountType } from "../../store/slices/auth";
import { useLogoutMutation } from "../../hooks/useAuthQuery";
import { customToast } from "@/src/helpers/customToast";
import {
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiBriefcase,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";
import { capitalizeFirstLetter } from "@/src/helpers/capitalizeFirstLetter";
import Link from "next/link";

export const TopNav = memo(function TopNav({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}): JSX.Element {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, accountType } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: logoutMutation } = useLogoutMutation();

  // Avoid hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentNav = navLinks.find((link) => pathname.startsWith(link.href));
  const title = currentNav?.title || "Dashboard";

  const handleSwitchAccount = () => {
    const nextType =
      accountType === "INDIVIDUAL" ? "ORGANIZATION" : "INDIVIDUAL";
    dispatch(setAccountType(nextType));
    customToast.success(
      `Switched view to ${capitalizeFirstLetter(nextType)} Mode`,
    );
    setIsDropdownOpen(false);
  };

  const handleCreateCompany = () => {
    console.log("Create Company Clicked");
    customToast.info("Simulated Company creation process started!");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutMutation();
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 w-full shrink-0 items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-6 shadow-sm dark:shadow-slate-900/50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:hidden transition-colors"
          aria-label="Open Menu"
        >
          <FiMenu className="size-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100 min-w-fit">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
          <FiBell className="size-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-theme-primary ring-2 ring-white dark:ring-slate-950"></span>
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:shadow-sm group cursor-pointer border border-transparent bg-transparent focus:outline-none"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-primary/20 text-theme-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
              <p className="text-sm font-bold uppercase">
                {mounted && user?.firstName ? user.firstName.charAt(0) : "U"}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {mounted
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`
                  : ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                {mounted && accountType
                  ? `${capitalizeFirstLetter(accountType)} View`
                  : ""}
              </p>
            </div>
            <FiChevronDown className="hidden sm:block size-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 group-hover:text-gray-600 dark:group-hover:text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header Info */}
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
                {user?.subscriptionTier && (
                  <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-theme-primary/10 to-indigo-500/10 dark:from-theme-primary/20 dark:to-indigo-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-theme-primary uppercase">
                    {user.subscriptionTier} Plan
                  </span>
                )}
              </div>

              <div className="my-1.5 border-t border-gray-100 dark:border-slate-800/80" />

              {/* Action Links */}
              <div className="space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-theme-primary/5 dark:hover:bg-slate-800 hover:text-theme-primary transition-colors"
                >
                  <FiUser className="size-4 shrink-0" />
                  View Profile
                </Link>

                {/* Platinum-only switcher options */}
                {user?.subscriptionTier?.toUpperCase() === "PLATINUM" && (
                  <>
                    <button
                      onClick={handleSwitchAccount}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-theme-primary/5 dark:hover:bg-slate-800 hover:text-theme-primary transition-colors text-left cursor-pointer"
                    >
                      <FiBriefcase className="size-4 shrink-0" />
                      Switch to{" "}
                      {accountType === "INDIVIDUAL"
                        ? "Company Account"
                        : "Individual Account"}
                    </button>

                    <button
                      onClick={handleCreateCompany}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-theme-primary/5 dark:hover:bg-slate-800 hover:text-theme-primary transition-colors text-left cursor-pointer"
                    >
                      <FiPlus className="size-4 shrink-0" />
                      Create a Company
                    </button>
                  </>
                )}
              </div>

              <div className="my-1.5 border-t border-gray-100 dark:border-slate-800/80" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left cursor-pointer"
              >
                <FiLogOut className="size-4 shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
