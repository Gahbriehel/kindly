"use client";

import { Button } from "./ui/button";
import { FaCheck } from "react-icons/fa6"; // Assuming react-icons is available
import { motion } from "framer-motion";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100">
            Start free. Upgrade when it's worth it.
          </h2>
          <p className="text-xl text-[#5A534D] dark:text-gray-300">
            Try Kindly with no commitment. Upgrade only when you're ready to
            scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
          >
            <h3 className="text-2xl font-bold text-[#3D3530] dark:text-gray-100 mb-2">
              Free
            </h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-[#3D3530] dark:text-gray-100">
                $0
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                / Forever
              </span>
            </div>
            <p className="text-[#6B6560] dark:text-gray-300 mb-8">
              Perfect for getting started.
            </p>

            <Button className="cursor-pointer w-full bg-[#3D3530] text-white hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 mb-8">
              Start free
            </Button>

            <ul className="space-y-4 text-[#5A534D] dark:text-gray-300">
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Up to 25 clients
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Manual reminders
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Basic templates
              </li>
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-2 border-[#FF9B7A] rounded-2xl p-8 relative bg-[#FFF9F5] dark:bg-gray-900/50"
          >
            <div className="absolute top-0 right-0 bg-[#FF9B7A] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-[#3D3530] dark:text-gray-100 mb-2">
              Pro
            </h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-[#3D3530] dark:text-gray-100">
                Coming soon
              </span>
            </div>
            <p className="text-[#6B6560] dark:text-gray-300 mb-8">
              Affordable monthly plans for growing businesses.
            </p>

            <Button className="cursor-pointer w-full bg-[#FF9B7A] text-white hover:bg-[#FF8765] mb-8">
              Join waitlist
            </Button>

            <ul className="space-y-4 text-[#5A534D] dark:text-gray-300">
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Unlimited clients
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Smart notifications
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#FF9B7A]" /> Custom message templates
              </li>
            </ul>
            <p className="text-center text-sm text-[#8B8581] dark:text-gray-400 mt-4">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
