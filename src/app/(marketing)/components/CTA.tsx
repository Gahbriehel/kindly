"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 px-6 bg-[#3D3530] dark:bg-gray-900 transition-colors duration-300 text-white text-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif mb-6"
        >
          Your clients matter. Let them feel it.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Stop letting important moments slip by. Start making your clients feel
          valued, remembered, and cared for.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8"
        >
          <Button className="bg-[#FF9B7A] hover:bg-[#FF8765] text-white text-xl px-10 py-6 rounded-full h-auto">
            Get started for free
          </Button>
          <p className="mt-4 text-sm text-gray-400">
            Set it up once. Let the care continue.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
