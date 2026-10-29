"use client";

import "@/src/styles/globals.css";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { SideNav } from "../../components/UI/SideNav";
import { TopNav } from "../../components/UI/TopNav";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { LimitWarningModal } from "@/src/components/Modals/LimitWarningModal";
import { MobileNav } from "../../components/UI/MobileNav";
import { queryClient } from "@/src/utils/Providers";
import { logOut } from "@/src/store/slices/auth";
import { useLogoutMutation } from "../../hooks/useAuthQuery";
import { useProfileSync } from "../../hooks/usePermissions";
import { getRedirectFor } from "../../helpers/navLinks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { width = 0 } = useWindowDimension();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logOutModalDisplay, setLogOutModalDisplay] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openLogoutModal = useCallback(() => {
    setLogOutModalDisplay(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setLogOutModalDisplay(false);
  }, []);

  const { mutate: logoutMutation, isPending } = useLogoutMutation();

  const handleLogout = useCallback(() => {
    logoutMutation();
  }, [logoutMutation]);

  const handleMobileLogoutClick = useCallback(() => {
    closeMobileMenu();
    openLogoutModal();
  }, [closeMobileMenu, openLogoutModal]);
  useEffect(() => {
    if (!user) {
      dispatch(logOut());
      queryClient.clear();
      router.push("/login");
    }
  }, [user, router, dispatch]);

  useProfileSync();

  // Send staff away from pages their permissions don't cover.
  const redirectTo = user ? getRedirectFor(pathname, user) : null;
  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  return (
    <>
      <div
        id="app-layout-container"
        className="relative mx-auto flex h-screen w-full max-w-[2400px] overflow-hidden print:hidden"
      >
        {width >= 640 && (
          <SideNav collapsed={collapsed} onToggle={toggleCollapsed} />
        )}

        <div className="flex flex-1 min-w-0 flex-col relative h-full">
          <TopNav onMenuClick={toggleMobileMenu} />
          <main className="flex flex-1 flex-col overflow-auto bg-gray-50 dark:bg-theme-canvas p-4 pb-24 sm:p-6 sm:pb-12 transition-colors duration-200">
            {redirectTo ? null : children}
          </main>
        </div>

        {/* Mobile Navigation Drawer */}
        {width < 640 && (
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
            onLogoutClick={handleMobileLogoutClick}
          />
        )}

        <ConfirmActionModal
          actionName="Logout"
          display={logOutModalDisplay}
          close={closeLogoutModal}
          fn={handleLogout}
          loading={isPending}
        />

        <LimitWarningModal />
      </div>
    </>
  );
}
