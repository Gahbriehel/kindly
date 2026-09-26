"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/src/hooks/useAppSelector";

const AVATARS = [
  "https://i.pravatar.cc/64?img=11",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=47",
  "https://i.pravatar.cc/64?img=65",
];

export default function Home(): JSX.Element {
  const { accessToken } = useAppSelector((state) => state.auth);
  const router = useRouter();

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
    <div className="bg-[#021323] text-white h-screen flex flex-col font-inter selection:bg-theme-primary/30 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 min-h-0 flex overflow-hidden">
        <div className="w-full h-full max-h-full px-6 sm:px-10 lg:px-16 xl:px-24 flex flex-col justify-center lg:grid lg:grid-cols-2 lg:[grid-template-rows:1fr] gap-4 sm:gap-6 lg:gap-16 xl:gap-24">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl shrink-0 flex flex-col justify-center"
          >
            <span className="self-start inline-block text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-4">
              What&apos;s waiting inside
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-extrabold tracking-tight leading-[1.15] mb-4">
              Your mornings start with{" "}
              <span className="text-[#9AA5E6]">people</span>, not spreadsheets.
            </h1>

            <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-md mb-6">
              Every birthday, anniversary and follow-up in one calm list, with
              the invoice already written one click away.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-8">
              <div className="flex -space-x-3 shrink-0 sm:pt-0.5">
                {AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#021323]"
                  />
                ))}
              </div>
              <div className="text-sm leading-snug">
                <p className="text-white font-medium">
                  2,400 businesses never miss a client&apos;s big day
                </p>
                <p className="text-slate-500">
                  Set up your account in three steps
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex w-44 whitespace-nowrap items-center justify-center rounded-xl bg-white text-[#021323] font-semibold text-sm sm:text-base px-6 py-3 hover:bg-slate-200 transition-colors"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex w-44 whitespace-nowrap items-center justify-center rounded-xl bg-theme-primary text-white font-semibold text-sm sm:text-base px-6 py-3 hover:bg-theme-primary-hover transition-colors"
              >
                Sign in
              </Link>
            </div>
          </motion.div>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative hidden lg:flex flex-1 min-h-0 min-w-0 items-center justify-center overflow-hidden"
          >
            <Image
              src="/images/landing1.png"
              alt="Kindly calendar and client group preview"
              width={1386}
              height={1266}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white text-[#021323] shrink-0">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Image
            src="/images/kindly-logo.png"
            alt="Kindly"
            width={120}
            height={32}
            className="object-contain"
          />

          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <Link
              href="/about"
              className="hover:text-[#021323] transition-colors"
            >
              About
            </Link>
            <Link
              href="/help"
              className="hover:text-[#021323] transition-colors"
            >
              Help
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#021323] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#021323] transition-colors"
            >
              Terms
            </Link>
          </nav>

          <span className="text-xs text-slate-400">© 2026 Kindly</span>
        </div>
      </footer>
    </div>
  );
}
