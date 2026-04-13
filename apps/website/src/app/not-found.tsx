"use client";

import { motion } from "framer-motion";
import { BaseButton } from "./components/ui/button";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import type { JSX } from "react";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center relative overflow-hidden text-[#3D3530] dark:text-gray-100 bg-[#FFF9F5] dark:bg-gray-950 transition-colors duration-300">
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFD9C8] dark:bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE8DC] dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-[#FF9B7A]/20 dark:bg-gray-800 rounded-full blur-2xl flex items-center justify-center"></div>
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10 relative border border-gray-100 dark:border-gray-700"
          >
            <BsSearch className="w-12 h-12 text-[#FF9B7A]" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-7xl font-serif font-bold mb-4 text-[#3D3530] dark:text-gray-100"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl font-serif mb-6 text-[#5A534D] dark:text-gray-300"
        >
          Looks like this page got forgotten.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-[#6B6560] dark:text-gray-400 mb-10 max-w-lg"
        >
          Even the best of us lose track sometimes. We couldn't find the page
          you're looking for, but we can help you get back home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <BaseButton
            type="link"
            href="/"
            color="primary"
            icon={<BsArrowLeft />}
            position="icon-first"
            className="rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all border-none bg-[#FF9B7A] hover:bg-[#FF8765] text-white"
            text="Take me home"
          />
        </motion.div>
      </div>
    </div>
  );
}
