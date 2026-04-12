"use client";

import Image from "next/image";
import Link from "next/link";
import { BsChatHeart, BsCalendarHeart, BsHeart } from "react-icons/bs";
import { motion } from "framer-motion";
import "@/src/styles/globals.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Left Pane - Marketing / Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#FFF9F5] dark:bg-slate-900 p-16 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FF9B7A]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#FF9B7A]/5 rounded-full blur-[80px]" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          <Link href="/">
            <Image
              src="/images/logoK.png"
              alt="Kindly Logo"
              width={100}
              height={100}
              className="cursor-pointer dark:invert"
            />
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 flex flex-col gap-8 max-w-[540px]"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl leading-[1.1] font-serif tracking-tight text-[#3D3530] dark:text-slate-100"
          >
            Relationships deserve to be{" "}
            <span className="text-[#FF9B7A]">remembered</span>.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-[#5A534D] dark:text-slate-400 text-xl font-medium leading-relaxed"
          >
            Kindly helps you remember the moments that matter to your clients,
            building deeper connections with thoughtfulness.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="relative w-full h-[320px] mt-4 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5"
          >
            <Image
              src="/images/auth-image.jpg"
              alt="Conversations Mug"
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </motion.div>

        {/* Features Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="z-10 flex gap-10 text-sm text-[#5A534D] dark:text-slate-300"
        >
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md flex items-center justify-center text-[#FF9B7A] shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-[#FF9B7A] group-hover:text-white transition-all duration-300">
              <BsChatHeart size={24} />
            </div>
            <span className="max-w-[100px] leading-snug font-semibold">
              Thoughtful messages
            </span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md flex items-center justify-center text-[#FF9B7A] shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-[#FF9B7A] group-hover:text-white transition-all duration-300">
              <BsCalendarHeart size={24} />
            </div>
            <span className="max-w-[100px] leading-snug font-semibold">
              Smart reminders
            </span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md flex items-center justify-center text-[#FF9B7A] shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-[#FF9B7A] group-hover:text-white transition-all duration-300">
              <BsHeart size={24} />
            </div>
            <span className="max-w-[100px] leading-snug font-semibold">
              Build connections
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-gray-50/30 dark:bg-gray-900/10">
        {/* Mobile Logo */}
        <div className="absolute top-10 left-10 lg:hidden z-20">
          <Link href="/">
            <Image
              src="/images/logoK.png"
              alt="Kindly Logo"
              width={80}
              height={80}
              className="cursor-pointer dark:invert"
            />
          </Link>
        </div>

        <div className="w-full max-w-lg z-10">{children}</div>
      </div>
    </div>
  );
}
