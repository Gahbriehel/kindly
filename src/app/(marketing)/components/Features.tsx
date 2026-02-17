"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-[#FFF9F5] dark:bg-gray-950 overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100"
          >
            Your clients shouldn't feel like they're on a list. <br />
            <span className="text-[#FF9B7A]">They should feel remembered.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[#5A534D] dark:text-gray-300"
          >
            Simple, thoughtful, yours. <br />A dashboard that doesn't overwhelm
            — just what you need, when you need it.
          </motion.p>
        </div>

        {/* Dashboard Mockup UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 max-w-4xl mx-auto"
        >
          {/* Fake Browser header */}
          <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Col: Today & Upcoming */}
            <div className="md:col-span-1 space-y-8">
              {/* Today */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Today
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-[#FFF9F5] dark:bg-gray-800/50 rounded-xl border border-[#FF9B7A]/20 dark:border-gray-700">
                    <h5 className="font-bold text-[#3D3530] dark:text-gray-200">
                      Sarah Johnson
                    </h5>
                    <p className="text-sm text-[#FF9B7A]">🎂 Birthday today</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h5 className="font-bold text-[#3D3530] dark:text-gray-200">
                      Michael & Emma
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      💍 2nd Anniversary
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Upcoming this week
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg">
                    <h5 className="font-medium text-[#3D3530] dark:text-gray-200">
                      Tunde & Aisha
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💐 3rd Anniversary — Feb 15
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg">
                    <h5 className="font-medium text-[#3D3530] dark:text-gray-200">
                      David Chen
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🎂 Birthday — Feb 16
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Message Editor */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-950 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Message ready
              </h4>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-6 font-serif text-lg text-[#3D3530] dark:text-gray-200 leading-relaxed">
                <p className="mb-4">Happy 3rd Anniversary, Tunde & Aisha! 🎉</p>
                <p className="mb-4">
                  Three years since your beautiful day! Hope you're celebrating
                  and making wonderful memories together.
                </p>
                <p>— With love, Sarah</p>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-6 py-2 h-auto text-lg flex gap-2">
                  Send via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
