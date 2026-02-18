"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";
// import { ChevronDown } from "lucide-react"; // Optional if we add icons later

export function Hero() {
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] mt-8 flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1762960070624-92864239a639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aG91Z2h0ZnVsJTIwcHJvZmVzc2lvbmFsJTIwd2FybSUyMGxpZ2h0aW5nfGVufDF8fHx8MTc3MDkxNTYyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5]/90 via-[#FFE8DC]/90 to-[#FFD9C8]/90 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[4.5rem] leading-[1.1] mb-6 text-[#3D3530] dark:text-gray-100 font-serif"
        >
          Never forget your clients again.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-[1.75rem] leading-[1.4] mb-4 text-[#5A534D] dark:text-gray-300"
        >
          Remember birthdays, anniversaries, milestones — and reach out at the
          right time, without the stress.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-[1.125rem] leading-relaxed mb-10 italic text-[#6B6560] dark:text-gray-400 max-w-[600px] mx-auto"
        >
          Because your clients deserve more than forgotten promises and
          last-minute scrambles.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            className="bg-[#FF9B7A] hover:bg-[#FF8765] text-white text-[1.25rem] px-10 py-6 rounded-full h-auto dark:bg-[#FF9B7A] dark:hover:bg-[#FF8765]"
          >
            Get started for free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToHowItWorks}
            className="text-[#5A534D] hover:text-[#3D3530] dark:text-gray-300 dark:hover:text-white text-[1.125rem] gap-2"
          >
            See how it works
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="max-w-[500px] mx-auto p-6 border-l-4 border-[#FF9B7A] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg"
        >
          <p className="italic text-[#5A534D] dark:text-gray-300 text-[1.125rem] mb-2">
            "I always meant to send those messages… now I actually do."
          </p>
          <p className="text-[0.95rem] text-[#8B8581] dark:text-gray-400">
            — Real user
          </p>
        </motion.div>
      </div>
    </section>
  );
}
