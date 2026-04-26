"use client";

import "@/src/styles/globals.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../hooks/useAppSelector";
// import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { SideNav } from "../../components/UI/SideNav";
import { TopNav } from "../../components/UI/TopNav";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { MobileNav } from "../../components/UI/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { width = 0 } = useWindowDimension();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  // const dispatch = useAppDispatch();
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

  // const handleLogout = useCallback(async () => {
  //   try {
  //     await logout();
  //   } catch {
  //     // ignore
  //   }
  //   dispatch(logOut());
  //   queryClient.clear();
  //   router.push("/login");
  // }, [dispatch, router]);

  const handleMobileLogoutClick = useCallback(() => {
    closeMobileMenu();
    openLogoutModal();
  }, [closeMobileMenu, openLogoutModal]);
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

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
          <main className="flex flex-1 flex-col overflow-auto bg-gray-50 dark:bg-slate-900 p-4 pb-24 sm:p-6 sm:pb-12 transition-colors duration-200">
            {children}
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
          actionName="logout"
          display={logOutModalDisplay}
          close={closeLogoutModal}
          // fn={handleLogout}
          fn={() => {}}
        />
      </div>
    </>
  );
}
