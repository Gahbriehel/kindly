"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PiShieldCheck } from "react-icons/pi";
import { pricingData } from "../../data/pricingData";

const headingFont = {
  fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
};
const bodyFont = { fontFamily: "var(--font-inter), Inter, sans-serif" };

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 px-6 md:px-10 bg-white dark:bg-gray-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={bodyFont}
            className="inline-block font-bold text-sm tracking-[0.5px] text-[#2F3E9E] dark:text-indigo-400 mb-3"
          >
            {pricingData.badge}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              ...headingFont,
              fontWeight: 700,
              letterSpacing: "-1.1px",
            }}
            className="text-[#111827] dark:text-gray-100 text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[48.4px]"
          >
            {pricingData.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={bodyFont}
            className="text-[#6B7280] dark:text-gray-400 text-[15px] sm:text-[16px] leading-[26px] mt-4 max-w-xl mx-auto"
          >
            {pricingData.subtitle}
          </motion.p>

          {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex items-center rounded-full bg-[#EEF0F6] dark:bg-gray-800 p-1 border border-gray-200/60 dark:border-gray-700/60">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {pricingData.billingToggle.monthlyLabel}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{pricingData.billingToggle.yearlyLabel}</span>
                <span className="text-xs font-bold text-[#2F3E9E] dark:text-indigo-400">
                  {pricingData.billingToggle.discountBadge}
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
          {pricingData.plans.map((plan, index) => {
            const isPopular = plan.isPopular;
            const price =
              billingCycle === "monthly"
                ? plan.price.monthly
                : plan.price.yearly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-3xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl shadow-indigo-100/40 dark:shadow-none"
                    : "bg-[#F8F9FB] dark:bg-gray-900/60 border border-gray-100/80 dark:border-gray-800/80 hover:shadow-md"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && plan.popularBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
                    {plan.popularBadge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Description */}
                  <h3
                    style={headingFont}
                    className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1.5"
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={bodyFont}
                    className="text-sm text-gray-500 dark:text-gray-400 leading-snug min-h-[38px]"
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-6 flex items-baseline">
                    <span
                      style={headingFont}
                      className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight"
                    >
                      {price}
                    </span>
                    {plan.price.period && (
                      <span
                        style={bodyFont}
                        className="text-xs md:text-sm font-medium text-gray-400 dark:text-gray-500 ml-1.5"
                      >
                        {plan.price.period}
                      </span>
                    )}
                  </div>

                  {/* Included package header */}
                  {plan.includedHeader && (
                    <div className="mb-3.5 flex items-center gap-1">
                      <span
                        style={bodyFont}
                        className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100"
                      >
                        {plan.includedHeader}
                      </span>
                    </div>
                  )}

                  {/* Feature list */}
                  <ul className="space-y-3.5 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        style={bodyFont}
                        className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 font-medium"
                      >
                        <svg
                          className="w-4 h-4 text-[#2F3E9E] dark:text-indigo-400 shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <circle cx="10" cy="10" r="8" strokeWidth="1.75" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.75"
                            d="M6.5 10l2.5 2.5 4.5-5"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-2">
                  <Link
                    href={plan.cta.href}
                    style={bodyFont}
                    className={`block w-full py-3.5 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200 ${
                      plan.cta.variant === "primary"
                        ? "bg-[#283584] hover:bg-[#202c6f] text-white shadow-sm"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/80 shadow-2xs"
                    }`}
                  >
                    {plan.cta.text}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={bodyFont}
          className="flex items-center justify-center gap-2 mt-12 text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          <PiShieldCheck className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <span>{pricingData.footerNote}</span>
        </motion.div>
      </div>
    </section>
  );
}
