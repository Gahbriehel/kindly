"use client";

import { motion } from "framer-motion";
import { BaseButton } from "../(marketing)/components/ui/button";
import { BsLayers, BsHouseDoor } from "react-icons/bs";
import type { JSX } from "react";

export default function AppNotFound(): JSX.Element {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center relative overflow-hidden text-[#3D3530] dark:text-gray-100 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF9B7A]/30 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-400/20 to-transparent rounded-tr-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        <motion.div
          initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-6 relative"
        >
          <div className="relative flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
            <BsLayers className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            <div className="absolute -bottom-4 -right-4 bg-[#FF9B7A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              404 Error
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-bold mb-3 text-[#3D3530] dark:text-gray-100"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-500 dark:text-gray-400 mb-8"
        >
          The page you're trying to view in the dashboard doesn't exist or has
          been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <BaseButton
            type="link"
            href="/app"
            color="primary"
            icon={<BsHouseDoor className="w-4 h-4" />}
            position="icon-first"
            className="w-full sm:w-auto bg-[#3D3530] hover:bg-[#2A2320] text-white border-none"
            text="Back to Dashboard"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-sm text-gray-400"
        >
          If you think this is a mistake, please contact support.
        </motion.p>
      </div>
    </div>
  );
}
