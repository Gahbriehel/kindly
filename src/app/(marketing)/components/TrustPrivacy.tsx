"use client";

import { FaLock, FaUserShield, FaBan } from "react-icons/fa6"; // Assuming icons
import { motion } from "framer-motion";

export function TrustPrivacy() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100 mb-16"
        >
          Built on trust
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="text-4xl text-[#3D3530] dark:text-gray-300 mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-100">
              Your data stays private
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              We never share, sell, or use your client information for anything
              but helping you remember.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="text-4xl text-[#3D3530] dark:text-gray-300 mb-4">
              <FaUserShield />
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-100">
              You're always in control
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              Nothing gets sent without your approval. Every message is yours to
              review and send.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="text-4xl text-[#3D3530] dark:text-gray-300 mb-4">
              <FaBan />
            </div>
            <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-100">
              No spam, ever
            </h3>
            <p className="text-[#6B6560] dark:text-gray-400">
              We don't send marketing emails to your clients. This is your
              relationship, not ours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
