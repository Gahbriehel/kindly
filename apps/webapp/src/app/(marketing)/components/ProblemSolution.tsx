"use client";

import { motion } from "framer-motion";
import {
  FaRegCalendarTimes,
  FaHourglassHalf,
  FaRegStickyNote,
} from "react-icons/fa";

export function ProblemSolution() {
  const problems = [
    {
      icon: <FaRegCalendarTimes />,
      title: "You meant to send that birthday message",
      text: "But it was a busy week, and by the time you remembered, it was already the 15th.",
    },
    {
      icon: <FaHourglassHalf />,
      title: "You remembered the anniversary… days later",
      text: "And sending it late felt worse than not sending it at all.",
    },
    {
      icon: <FaRegStickyNote />,
      title: "You have a notes app full of good intentions",
      text: "Dates you swore you'd remember. Messages you meant to send. All gathering dust.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#FFF9F5] dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100"
          >
            You care — but you're human.
          </motion.h2>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-[#FF9B7A]/20 dark:border-gray-800 hover:shadow-md transition-all duration-300"
            >
              <div className="text-4xl text-[#FF9B7A] mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#3D3530] dark:text-gray-200 mb-4 min-h-[56px]">
                {item.title}
              </h3>
              <p className="text-[#6B6560] dark:text-gray-400 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <p className="text-2xl md:text-3xl font-serif text-[#3D3530] dark:text-gray-200 mb-4">
            The problem isn't that you don't value your clients
          </p>
          <p className="text-xl md:text-2xl text-[#FF9B7A] font-bold tracking-wide uppercase">
            It's that remembering doesn't scale.
          </p>
        </motion.div>

        {/* Solution Intro */}
        <div className="text-center pt-12 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[#3D3530] dark:text-gray-100 mb-6">
              So we built a better way to remember.
            </h2>
            <p className="text-xl text-[#5A534D] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kindly isn't just another CRM. It's not about pipelines,
              conversions, or metrics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-[#6B6560] dark:text-gray-400 mb-4">
              No awkward automation. No cold CRM pipelines. Just thoughtful
              follow-ups that feel human.
            </p>
            <p className="text-lg font-medium text-[#3D3530] dark:text-gray-200 italic">
              Because when you reach out, it should feel like you — not like
              software.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
