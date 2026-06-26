"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { RiHeartFill, RiBuilding4Fill, RiArrowRightLine } from "react-icons/ri";
import { BaseButton } from "../components/UI/Buttons";
import { FaPerson } from "react-icons/fa6";

export default function Home(): JSX.Element {
  const { accessToken } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [accessToken, router]);

  // If authenticated, render nothing while redirecting
  if (accessToken) {
    return <></>;
  }

  return (
    <div className="bg-[#021323] text-white min-h-screen relative overflow-hidden font-inter flex flex-col justify-between selection:bg-sky-500/30">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-theme-primary/5 rounded-full blur-[140px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-6 md:px-12 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/kindly-logo-dark.png"
            alt="Kindly Logo"
            width={150}
            height={150}
            className="object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-12 text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-theme-primary uppercase mb-4 block animate-pulse">
            Kindly Workspace
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-[1.15] mb-12">
            Coordinate and track impact in one workspace.
          </h1>

          {/* Feature / Portal Selection Stack */}
          <div className="w-full flex flex-col items-center gap-4 mb-10">
            {/* Individual Portal Pill */}
            <Link
              href="/login?type=individual"
              className="flex items-center gap-4 px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-2xl text-left hover:bg-slate-800/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 w-full max-w-lg group cursor-pointer backdrop-blur-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-theme-primary/20 rounded-xl flex items-center justify-center text-theme-primary group-hover:scale-105 transition-transform duration-200">
                <FaPerson className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-base leading-snug">
                  Individual Portal
                </h3>
                <p className="text-sm text-slate-400 truncate">
                  Manage clients and connect with organizations
                </p>
              </div>
              <RiArrowRightLine className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Organization Portal Pill */}
            <Link
              href="/login?type=organization"
              className="flex items-center gap-4 px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-2xl text-left hover:bg-slate-800/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 w-full max-w-lg group cursor-pointer backdrop-blur-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-theme-primary/20 rounded-xl flex items-center justify-center text-theme-primary group-hover:scale-105 transition-transform duration-200">
                <RiBuilding4Fill className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-base leading-snug">
                  Organization Portal
                </h3>
                <p className="text-sm text-slate-400 truncate">
                  Manage operations, moderators, and events
                </p>
              </div>
              <RiArrowRightLine className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <BaseButton
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-2/3"
            text="Sign in"
            icon={<RiArrowRightLine className="w-4 h-4" />}
            position="icon-first"
            color="primary"
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-sm text-slate-500 border-t border-slate-800/30 z-10 bg-slate-950/20">
        © 2026 Kindly. All rights reserved.
      </footer>

      {/* Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-slate-900/90 border border-slate-700/50 w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl z-10 overflow-hidden backdrop-blur-xl"
            >
              {/* Inner Glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Select Your Portal
              </h2>
              <p className="text-slate-400 text-center text-sm mb-8">
                Choose how you want to sign in to Kindly
              </p>

              <div className="space-y-4">
                <Link
                  href="/login?type=individual"
                  className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-500/50 rounded-2xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-theme-primary/20 rounded-xl flex items-center justify-center text-theme-primary">
                      <RiHeartFill className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-white group-hover:text-theme-primary transition-colors">
                        Individual Portal
                      </h4>
                      <p className="text-xs text-slate-400">
                        Volunteers & Donors
                      </p>
                    </div>
                  </div>
                  <RiArrowRightLine className="w-5 h-5 text-slate-500 group-hover:text-theme-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/login?type=organization"
                  className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-500/50 rounded-2xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-theme-primary/20 rounded-xl flex items-center justify-center text-theme-primary">
                      <RiBuilding4Fill className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                        Organization Portal
                      </h4>
                      <p className="text-xs text-slate-400">
                        Non-profits & Staff
                      </p>
                    </div>
                  </div>
                  <RiArrowRightLine className="w-5 h-5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-8 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer w-full text-center"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
