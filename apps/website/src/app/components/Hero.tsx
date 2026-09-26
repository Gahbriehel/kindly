"use client";

import { BaseButton } from "./ui/button";
import { motion } from "framer-motion";
import { BiChevronRight, BiCalendarCheck } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import { PiCake, PiHeart, PiBriefcase, PiBellSimple } from "react-icons/pi";

const socialProofAvatars = [
  "/images/anniversary-lady.jpg",
  "/images/birthday-guy.jpg",
  "/images/sarah-johnson.jpg",
  "/images/anniversary-guy.jpg",
];

function Circle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`aspect-square w-full rounded-full flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function Hero() {
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-18 pb-20 md:pt-22 md:pb-28 px-6 md:px-10">
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
        {/* Left column */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full bg-[#EEF0F9] dark:bg-gray-900 px-4 py-1.5 text-sm font-medium text-[#26337F] dark:text-gray-300 mb-6"
          >
            <BiCalendarCheck className="text-base" />
            Client management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-jakarta text-4xl sm:text-5xl lg:text-[64px] leading-[1.15] lg:leading-[67.2px] font-extrabold tracking-tight lg:tracking-[-1.6px] text-gray-900 dark:text-gray-50 mb-6 lg:max-w-[613px] mx-auto lg:mx-0"
          >
            Your clients remember who{" "}
            <span className="relative inline-block whitespace-nowrap">
              remembered
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
            </span>{" "}
            them.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg leading-relaxed text-gray-500 dark:text-gray-400 mb-10 max-w-[520px] mx-auto lg:mx-0"
          >
            Kindly keeps every client, birthday, anniversary and follow-up in
            one place, then tells you who to reach out to today, and writes the
            message with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
          >
            <BaseButton
              type="link"
              href="/register"
              icon={<BiChevronRight />}
              color="secondary"
              text="Start free with 5 clients"
              className="w-full max-w-[280px] sm:w-auto !text-base !rounded-full !border-[#2F3E9E] !bg-[#2F3E9E] hover:!bg-[#26337F]"
            />
            <BaseButton
              color="outline"
              onClick={scrollToHowItWorks}
              icon={<BsChevronDown />}
              text="See how it works"
              className="w-full max-w-[280px] sm:w-auto !text-base !rounded-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex items-center gap-4 justify-center lg:justify-start"
          >
            <div className="flex -space-x-3 shrink-0">
              {socialProofAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-950"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                2,400 businesses keep their client dates here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Set up your account in three steps
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column — illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative block w-full max-w-[320px] sm:max-w-[480px] mx-auto lg:max-w-[560px] pb-14 pl-6"
        >
          <div className="relative grid grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Circle>
                <img
                  src="/images/anniversary-lady.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Circle>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-3 -left-5 flex items-center gap-1.5 rounded-full bg-[#12162B] text-white text-xs font-medium pl-2.5 pr-3 py-1.5 shadow-lg whitespace-nowrap"
              >
                <PiBriefcase className="text-sm" />
                Work anniversary
              </motion.div>
            </div>
            <Circle className="bg-[#D9DEF5]" />
            <div className="relative">
              <Circle>
                <img
                  src="/images/birthday-guy.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Circle>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-3 -right-4 flex items-center gap-1.5 rounded-full bg-[#12162B] text-white text-xs font-medium px-3 py-1.5 shadow-lg whitespace-nowrap"
              >
                <PiCake className="text-sm" />
                Birthday
              </motion.div>
            </div>

            <Circle className="bg-[#BFEAD9]" />
            <Circle className="bg-[#161E3D] flex-col text-white">
              <span className="text-3xl md:text-4xl font-bold leading-none">
                48
              </span>
              <span className="text-[0.7rem] text-white/70 mt-1">
                dates kept
              </span>
            </Circle>
            <div className="relative">
              <Circle className="bg-[#FBD3DC]" />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-3 -right-4 flex items-center gap-1.5 rounded-full bg-[#FFE7ED] text-[#E24C74] text-xs font-medium px-3 py-1.5 shadow-lg whitespace-nowrap"
              >
                <PiHeart className="text-sm" />
                Anniversary
              </motion.div>
            </div>

            <Circle>
              <img
                src="/images/sarah-johnson.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </Circle>
            <Circle className="bg-[#F6D889]" />
            <Circle>
              <img
                src="/images/anniversary-guy.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </Circle>
          </div>

          {/* Floating reminder card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            className="absolute -bottom-2 -left-6 w-[260px] rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#FBD3DC] flex items-center justify-center text-xs font-semibold text-[#B3435F]">
                  SJ
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Birthday
                  </p>
                </div>
              </div>
              <PiBellSimple className="text-gray-300 dark:text-gray-600 text-lg shrink-0" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
              Today
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A45]" />
              Send message
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
