"use client";

import { motion } from "framer-motion";
import {
  PiCloudArrowUp,
  PiUsers,
  PiBellSimpleRinging,
  PiPaperPlaneTilt,
} from "react-icons/pi";

const steps = [
  {
    number: "01",
    title: "Bring your list in",
    description:
      "Create your list of clients by typing the required inputs into the text field. Names and dates, nothing else.",
    icon: <PiCloudArrowUp className="w-6 h-6 text-white" />,
    iconBg: "bg-[#2F3E9E]",
  },
  {
    number: "02",
    title: "Keep households together",
    description:
      "Add a partner with a relationship and the two become one group with one shared date.",
    icon: <PiUsers className="w-6 h-6 text-[#111827]" />,
    iconBg: "bg-[#FCD34D]",
  },
  {
    number: "03",
    title: "Get told, not reminded",
    description:
      "Kindly surfaces who is coming up this week and what the milestone actually means.",
    icon: <PiBellSimpleRinging className="w-6 h-6 text-white" />,
    iconBg: "bg-[#059669]",
  },
  {
    number: "04",
    title: "Send something they keep",
    description:
      "Pick a template, change a line, send by email, SMS or WhatsApp. It logs to their history.",
    icon: <PiPaperPlaneTilt className="w-6 h-6 text-white" />,
    iconBg: "bg-[#F43F5E]",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#F1F2F4] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row: Headline/Description + Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="font-inter font-bold text-sm tracking-[0.5px] text-[#2F3E9E] mb-4">
              How it works
            </span>
            <h2
              style={{
                fontFamily:
                  "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "-1.1px",
              }}
              className="text-[#111827] text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[48.4px] max-w-[635px] mb-5"
            >
              Set it up once. It runs
              <br className="hidden sm:inline" /> quietly from then on.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 400,
                letterSpacing: "0px",
              }}
              className="text-[#6B7280] text-[16px] leading-[26px] max-w-[438px]"
            >
              Four short steps and your whole client year is built with every
              date in place, every reminder timed, every message one click from
              sent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[580px] overflow-hidden rounded-2xl">
              <img
                src="/images/work.png"
                alt="Illustration showing how Kindly works"
                className="w-full h-auto object-contain block"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom row: 4 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${step.iconBg}`}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontFamily:
                      "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "48px",
                    lineHeight: "48px",
                    letterSpacing: "-1.2px",
                    color: "#1118271A",
                    verticalAlign: "middle",
                    display: "inline-flex",
                    alignItems: "center",
                    width: "62px",
                    height: "48px",
                  }}
                  className="select-none"
                >
                  {step.number}
                </span>
              </div>
              <h3 className="font-jakarta font-bold text-lg sm:text-[19px] text-[#111827] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="font-inter font-normal text-sm leading-[22px] text-[#6B7280]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
