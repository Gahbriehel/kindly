"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";

export function CTA() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-[1352px] w-full min-h-[412px] mx-auto bg-[#2F3E9E] rounded-[32px] p-8 sm:p-10 lg:p-[56px] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[40px]">
        {/* Background "Kindly" watermark */}
        <div
          aria-hidden="true"
          className="absolute left-4 lg:left-[16px] -bottom-4 lg:bottom-6 select-none pointer-events-none z-0 whitespace-nowrap text-[#FFFFFF0F] font-jakarta font-extrabold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[208px] leading-none lg:leading-[166.4px] tracking-[-4px] sm:tracking-[-7px] lg:tracking-[-10.4px]"
          style={{
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          Kindly
        </div>

        {/* Left Column: Heading, Subtitle & Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-start text-left max-w-xl"
        >
          <h2 className="font-jakarta font-extrabold text-white text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] leading-[1.15] tracking-[-0.02em] mb-4">
            Your next client milestone is <br className="hidden sm:inline" />
            probably this week
          </h2>

          <p className="font-inter text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-[480px]">
            Import your list and Kindly will tell you whose it is before it
            passes.
          </p>

          <Link
            href={process.env.NEXT_PUBLIC_SIGNUP_URL || ""}
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-full hover:bg-gray-100 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm sm:text-base group"
          >
            <span>Create your account</span>
            <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Right Column: Illustration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full lg:w-auto flex-1 max-w-[520px] xl:max-w-[560px] flex items-center justify-center lg:justify-end"
        >
          <div className="bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden p-3 sm:p-5 md:p-6 w-full shadow-lg shadow-black/10 flex items-center justify-center">
            <Image
              src="/images/cta.png"
              alt="Client milestone reminder"
              width={990}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
