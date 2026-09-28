"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BiChevronRight } from "react-icons/bi";
import { HiArrowLeft } from "react-icons/hi2";
import { PiCake, PiBellSimple } from "react-icons/pi";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function NotFound() {
  const signupUrl = process.env.NEXT_PUBLIC_SIGNUP_URL || "";

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-[#FF9B7A]/30 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 relative overflow-hidden flex items-center justify-center py-16 sm:py-20 md:py-28 px-6 md:px-10">
        {/* Ambient background glows */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#2F3E9E]/10 dark:bg-[#4756BE]/15 rounded-full filter blur-[100px] pointer-events-none -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[300px] bg-[#FF9B7A]/10 dark:bg-[#FF6A45]/10 rounded-full filter blur-[90px] pointer-events-none -z-10"
        />

        {/* Giant background "404" watermark */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0 whitespace-nowrap font-jakarta font-extrabold text-[#111827]/[0.03] dark:text-white/[0.03] text-[200px] sm:text-[280px] md:text-[380px] lg:text-[460px] leading-none tracking-[-8px] sm:tracking-[-16px] lg:tracking-[-24px]"
          style={{
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          404
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Floating interactive reminder preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative mb-8 w-full max-w-[340px] sm:max-w-[380px]"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-2xl bg-[#161D49] text-white p-4 sm:p-5 shadow-2xl border border-white/10 text-left overflow-hidden"
            >
              {/* Card top */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-[#FBD3DC] flex items-center justify-center text-xs font-bold text-[#B3435F]">
                    404
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
                      Unknown Milestone
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/60">
                      Off the calendar
                    </p>
                  </div>
                </div>
                <PiBellSimple className="text-white/40 text-base shrink-0" />
              </div>

              <p className="text-xs sm:text-sm font-medium text-white/90 mb-2">
                This page could not be found
              </p>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A45] shrink-0" />
                <span>Redirecting back to home</span>
              </div>

              {/* Floating pill tags */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-[#FF6A45] text-white text-[10px] font-semibold px-2.5 py-1 shadow-md whitespace-nowrap"
              >
                <PiCake className="text-xs" />
                Lost date
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              fontFamily:
                "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
            }}
            className="font-jakarta text-3xl sm:text-5xl lg:text-[56px] leading-[1.15] lg:leading-[60px] font-extrabold tracking-tight lg:tracking-[-1.4px] text-gray-900 dark:text-gray-50 mb-6 max-w-2xl"
          >
            Looks like this page got{" "}
            <span className="relative inline-block whitespace-nowrap">
              forgotten
              <svg
                viewBox="0 0 300 60"
                className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+1.5rem)] h-[calc(100%+1rem)] text-[#4756BE]"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M12 30C12 12 60 4 150 4C240 4 288 12 288 30C288 48 240 56 150 56C60 56 12 48 12 30Z"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </span>
            .
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
            className="text-base sm:text-lg leading-relaxed text-[#6B7280] dark:text-gray-400 mb-10 max-w-[540px]"
          >
            Even the best of us lose track sometimes. We couldn&apos;t find the
            page you&apos;re looking for, but we can help you get back to your
            clients.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
          >
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#2F3E9E] hover:bg-[#26337F] text-white font-semibold px-7 py-3.5 text-sm sm:text-base transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Take me home</span>
            </Link>

            {signupUrl && (
              <Link
                href={signupUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold px-7 py-3.5 text-sm sm:text-base transition-all duration-200 shadow-2xs active:scale-[0.98]"
              >
                <span>Get started</span>
                <BiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </Link>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
