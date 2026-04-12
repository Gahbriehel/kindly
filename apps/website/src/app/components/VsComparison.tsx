"use client";

import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export function VsComparison() {
  const comparisons = [
    {
      kindly: "You send every message",
      crm: "Automated drip campaigns",
    },
    {
      kindly: "Personal, warm, human",
      crm: "Template-driven and robotic",
    },
    {
      kindly: "Remembers what matters to them",
      crm: "Tracks what matters to you",
    },
    {
      kindly: "Never sends without you",
      crm: "Auto-sends on your behalf",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#FF9B7A] font-bold tracking-wider uppercase mb-4"
          >
            What makes this different
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100"
          >
            We're not trying to replace you. <br />
            We're trying to help you be more you.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Kindly Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FFF9F5] dark:bg-gray-800 p-8 rounded-2xl border-2 border-[#FF9B7A]/20 dark:border-[#FF9B7A]/30"
          >
            <div className="flex items-center gap-3 mb-8">
              {/* Logo placeholder or text */}
              <span className="text-2xl font-serif font-bold text-[#3D3530] dark:text-white">
                Kindly
              </span>
            </div>
            <ul className="space-y-6">
              {comparisons.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 min-w-[20px] text-[#FF9B7A]">
                    <FaCheck />
                  </div>
                  <span className="text-lg text-[#5A534D] dark:text-gray-200 font-medium">
                    {item.kindly}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Typical CRM Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-serif font-bold text-gray-400 dark:text-gray-500">
                Typical CRM
              </span>
            </div>
            <ul className="space-y-6">
              {comparisons.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 min-w-[20px] text-gray-300 dark:text-gray-600">
                    <FaTimes />
                  </div>
                  <span className="text-lg text-gray-400 dark:text-gray-500 line-through decoration-gray-300 dark:decoration-gray-600">
                    {item.crm}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
