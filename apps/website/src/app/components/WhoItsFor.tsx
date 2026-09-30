"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { whoItsForData } from "../../data/whoItsForData";

const headingFont = {
  fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
};
const bodyFont = { fontFamily: "var(--font-inter), Inter, sans-serif" };

const AUTO_SWITCH_MS = 5000;

export function WhoItsFor() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeTab = whoItsForData.tabs[activeIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % whoItsForData.tabs.length);
    }, AUTO_SWITCH_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  return (
    <section
      id="who-its-for"
      className="py-20 md:py-28 px-6 md:px-10 bg-[#F8F9FB] dark:bg-gray-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={bodyFont}
            className="block font-bold text-sm tracking-[0.5px] text-[#2F3E9E] dark:text-indigo-400 mb-4"
          >
            {whoItsForData.badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              ...headingFont,
              fontWeight: 700,
              letterSpacing: "-1.1px",
            }}
            className="text-[#111827] dark:text-gray-100 text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[48.4px]"
          >
            {whoItsForData.title}
          </motion.h2>
        </div>

        {/* Tabs + content */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        >
          {/* Tab list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3"
          >
            {whoItsForData.tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  style={bodyFont}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl text-left transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#EEF0FF] dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <span
                    className={`text-[15px] ${
                      isActive
                        ? "font-semibold text-[#111827] dark:text-gray-100"
                        : "font-medium text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isActive
                        ? "font-medium text-[#2F3E9E] dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {tab.stat}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Content card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  style={bodyFont}
                  className="block text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 mb-3"
                >
                  {activeTab.tracking}
                </span>
                <h3
                  style={headingFont}
                  className="text-xl md:text-2xl font-bold text-[#111827] dark:text-gray-100 leading-snug mb-6"
                >
                  {activeTab.headline}
                </h3>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <img
                    src={activeTab.image}
                    alt={activeTab.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
