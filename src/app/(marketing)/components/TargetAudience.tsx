"use client";

import { motion } from "framer-motion";

export function TargetAudience() {
  const audiences = [
    "Event planners",
    "Photographers",
    "Coaches & consultants",
    "Real estate agents",
    "Wedding vendors",
    "Stylists & beauty pros",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-24 px-6 bg-[#FFF9F5] dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100 mb-6"
        >
          Built for people-first businesses
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-[#5A534D] dark:text-gray-300 mb-12"
        >
          If relationships matter in your business, this was built for you.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-center border border-transparent dark:border-gray-700"
            >
              <p className="font-medium text-[#5A534D] dark:text-gray-200">
                {audience}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
