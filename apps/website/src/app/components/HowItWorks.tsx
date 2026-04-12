"use client";

import { motion } from "framer-motion";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100 mb-6">
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#FF9B7A]/10 dark:bg-[#FF9B7A]/20 rounded-full flex items-center justify-center text-[#FF9B7A] text-2xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-200">
              Save your clients
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              Add their important dates — birthdays, anniversaries, anything
              that matters.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#FF9B7A]/10 dark:bg-[#FF9B7A]/20 rounded-full flex items-center justify-center text-[#FF9B7A] text-2xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-200">
              Choose how you want to be reminded
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              Get notified, review upcoming dates, or let Kindly prepare
              messages for you.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#FF9B7A]/10 dark:bg-[#FF9B7A]/20 rounded-full flex items-center justify-center text-[#FF9B7A] text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-200">
              Send with one tap
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              Open WhatsApp (or any app) with your message ready. You just hit
              send.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
