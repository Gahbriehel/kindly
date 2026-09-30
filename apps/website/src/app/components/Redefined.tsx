"use client";

import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { BiCheck } from "react-icons/bi";
import { PiBellSimpleRinging, PiNotePencil } from "react-icons/pi";

const historyItems = [
  {
    text: "You messaged Eric Johnson",
    time: "2 hours ago",
  },
  {
    text: "Template 'Birthday Wishes' used",
    time: "2 days ago",
  },
  {
    text: "Added Michael & Lisa Chen",
    time: "Yesterday",
  },
  {
    text: "Emma Rodriguez milestone noted",
    time: "3 days ago",
  },
];

const checklistItems = [
  "Who is celebrating",
  "Who to write to today",
  "What the date means",
  "What you said last year",
];

const tickerItems = [
  "Birthdays",
  "Move-in anniversaries",
  "Wedding anniversaries",
  "Work anniversaries",
  "Policy renewals",
  "New babies",
  "Graduations",
];

function InlineAvatar({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      className="inline-block h-9 w-9 sm:h-11 sm:w-11 rounded-2xl object-cover align-middle mx-1 -translate-y-1"
    />
  );
}

export function Redefined() {
  const scrollToTargetAudience = () => {
    document
      .getElementById("target-audience")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#12162B] py-20 md:py-28 px-6 md:px-10">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex items-center justify-between gap-6 mb-10 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-inter font-bold text-sm leading-4 tracking-[2.16px] text-gray-400"
          >
            Client management, redefined
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={scrollToTargetAudience}
            className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            See who it&apos;s for
            <HiArrowUpRight className="text-base" />
          </motion.button>
        </div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-jakarta text-4xl sm:text-5xl lg:text-[64px] leading-[1.15] lg:leading-[100%] font-extrabold tracking-tight lg:tracking-[-1.6px] max-w-5xl"
        >
          <span className="text-white">Client management</span>
          <InlineAvatar src="/images/anniversary-lady.jpg" />
          <span className="text-white">is not a</span>{" "}
          <span className="text-gray-500">pipeline. It is remembering</span>
          <InlineAvatar src="/images/sarah-johnson.jpg" />
          <span className="text-gray-500">people and the dates</span>
          <InlineAvatar src="/images/anniversary-guy.jpg" />
          <span className="text-gray-500">that </span>
          <span className="text-gray-500 underline decoration-white/60 underline-offset-4">
            made them clients.
          </span>
        </motion.h2>

        {/* Cards grid */}
        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-[#4756BE] p-8 min-h-[220px] flex flex-col justify-end"
            >
              <PiBellSimpleRinging className="absolute -right-4 -bottom-4 text-[140px] text-white/10" />
              <h3 className="relative font-jakarta text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Reminder sent
              </h3>
              <p className="relative text-white/80 text-sm leading-relaxed max-w-xs">
                From this morning&apos;s reminder to a personal message that is
                sent, logged and visible to your whole team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 flex-1 flex flex-col md:flex-row md:items-center gap-8"
            >
              <PiNotePencil className="absolute -right-2 -bottom-2 text-[100px] text-gray-50" />
              <div className="relative">
                <h3 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                  1 list
                </h3>
                <p className="text-gray-500 text-sm max-w-[200px]">
                  shared by everyone, so nobody sends the same greeting twice.
                </p>
              </div>
              <ul className="relative grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-gray-700 md:ml-auto">
                {checklistItems.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <BiCheck className="text-[#2F3E9E] text-lg shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-white p-6"
            >
              <div className="flex items-center gap-1.5 mb-5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6058]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-xs text-gray-400 font-medium">
                  Sarah Johnson · History
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-4">
                One shared history
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {historyItems.map((item) => (
                  <div key={item.text} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4756BE] shrink-0" />
                    <div>
                      <p className="text-gray-800 leading-snug">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-8 flex-1 flex flex-col justify-center"
            >
              <p className="text-lg sm:text-xl text-white font-medium leading-snug mb-4">
                &ldquo;We stopped keeping a birthday spreadsheet the week we
                moved in.&rdquo;
              </p>
              <p className="text-sm text-gray-400">
                Imani O. · agency owner, 310 clients
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative mt-16 md:mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1, 2, 3].map((copy) => (
            <div
              key={copy}
              className="flex items-center shrink-0"
              aria-hidden={copy !== 0}
            >
              {tickerItems.map((item, i) => (
                <span
                  key={`${copy}-${item}-${i}`}
                  className="flex items-center gap-6 text-sm font-semibold text-gray-500 pr-6"
                >
                  {item}
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
