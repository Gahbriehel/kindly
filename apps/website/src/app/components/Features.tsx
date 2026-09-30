"use client";

import { motion } from "framer-motion";
import {
  PiCalendarBlank,
  PiUsersThree,
  PiFileText,
  PiChatCircleDots,
  PiReceipt,
  PiBellSimpleRinging,
  PiShieldCheck,
  PiCheck,
} from "react-icons/pi";

const headingFont = {
  fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
};
const bodyFont = { fontFamily: "var(--font-inter), Inter, sans-serif" };

function CardHeading({
  icon,
  iconBg,
  title,
  description,
  titleColor,
  descColor,
  titleStyle,
  descStyle,
  titleClassName = "",
  descClassName = "",
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: React.ReactNode;
  titleColor: string;
  descColor: string;
  titleStyle?: React.CSSProperties;
  descStyle?: React.CSSProperties;
  titleClassName?: string;
  descClassName?: string;
}) {
  return (
    <div>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}
      >
        {icon}
      </div>
      <h3
        style={{ ...headingFont, ...titleStyle }}
        className={`font-bold text-lg mb-2.5 ${titleColor} ${titleClassName}`}
      >
        {title}
      </h3>
      <p
        style={{ ...bodyFont, ...descStyle }}
        className={`text-sm leading-[22px] ${descColor} ${descClassName}`}
      >
        {description}
      </p>
    </div>
  );
}

const messageInvoiceTitleStyle: React.CSSProperties = {
  fontSize: "17px",
  lineHeight: "23.38px",
  letterSpacing: "0px",
};
const messageInvoiceDescStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22.75px",
  letterSpacing: "0px",
};

export function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-28 px-6 md:px-10 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <span
              style={bodyFont}
              className="block font-bold text-sm tracking-[0.5px] text-[#2F3E9E] mb-4"
            >
              What you get
            </span>
            <h2
              style={{
                ...headingFont,
                fontWeight: 700,
                letterSpacing: "-1.1px",
              }}
              className="text-[#111827] dark:text-gray-100 text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[48.4px] max-w-[620px]"
            >
              Everything client management actually needs
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={bodyFont}
            className="lg:col-span-5 text-[#6B7280] dark:text-gray-400 text-[16px] leading-[26px] lg:pt-2"
          >
            No pipelines, no deal stages, no fields you will never fill. Just
            the people you look after and the dates that matter to them.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col gap-6">
          {/* Row 1: Calendar (large, navy) + Groups (small, white) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 rounded-2xl bg-[#161D49] p-6 md:p-8"
            >
              <CardHeading
                icon={<PiCalendarBlank className="w-5 h-5 text-white" />}
                iconBg="bg-white/10"
                title="A calendar of people, not meetings"
                description="Every birthday, anniversary and custom milestone on one month grid, colour-coded by type, with the day's detail beside it."
                titleColor="text-white"
                descColor="text-gray-300"
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <img
                  src="/images/calendar.png"
                  alt="Calendar view of client milestones"
                  className="w-full h-auto rounded-xl col-span-2"
                />
                <img
                  src="/images/comingup.png"
                  alt="Coming up list of client milestones"
                  className="w-full h-auto rounded-xl col-span-1"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8"
            >
              <CardHeading
                icon={<PiUsersThree className="w-5 h-5 text-[#2F3E9E]" />}
                iconBg="bg-[#EEF0FF] dark:bg-gray-800"
                title="Groups and households"
                description="A couple or a family is one client with one shared date, message everyone, or just one person."
                titleColor="text-[#111827] dark:text-gray-100"
                descColor="text-[#6B7280] dark:text-gray-400"
              />
              <img
                src="/images/groups.png"
                alt="A grouped household client card"
                className="w-full h-auto rounded-xl mt-6"
              />
            </motion.div>
          </div>

          {/* Row 2: Templates (small, white) + Message (large, navy) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8"
            >
              <CardHeading
                icon={<PiFileText className="w-5 h-5 text-[#2F3E9E]" />}
                iconBg="bg-[#EEF0FF] dark:bg-gray-800"
                title="Templates that sound like you"
                description="Write once per occasion, categorise it, and reuse it with a personal line on top."
                titleColor="text-[#111827] dark:text-gray-100"
                descColor="text-[#6B7280] dark:text-gray-400"
              />
              <img
                src="/images/template.png"
                alt="A list of reusable message templates"
                className="w-full h-auto rounded-xl mt-6"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 rounded-2xl bg-[#161D49] p-6 md:p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start h-full">
                <div>
                  <CardHeading
                    icon={
                      <PiChatCircleDots className="w-5 h-5 text-[#2F3E9E]" />
                    }
                    iconBg="bg-white"
                    title="One message, one history, whole team"
                    description="Send by email, SMS or WhatsApp from the same panel. Everything anyone sends is logged against that client, so nobody doubles up."
                    titleColor="text-white"
                    descColor="text-gray-300"
                    titleStyle={messageInvoiceTitleStyle}
                    descStyle={messageInvoiceDescStyle}
                    titleClassName="max-w-[320px]"
                    descClassName="max-w-[425px]"
                  />
                  <div className="flex flex-wrap gap-2 mt-5">
                    {["Email", "SMS", "WhatsApp", "Scheduled sends"].map(
                      (label) => (
                        <span
                          key={label}
                          style={bodyFont}
                          className="px-3.5 py-1.5 rounded-full bg-gray-100 text-[#111827] text-xs font-medium"
                        >
                          {label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <img
                  src="/images/message.png"
                  alt="A message composer with template and channel selection"
                  className="w-full h-auto rounded-xl self-end"
                />
              </div>
            </motion.div>
          </div>

          {/* Row 3: Invoice (large, navy) + Reminders & Staff (small, stacked) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 rounded-2xl bg-[#161D49] p-6 md:p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <div>
                  <CardHeading
                    icon={<PiReceipt className="w-5 h-5 text-[#2F3E9E]" />}
                    iconBg="bg-white"
                    title="Plan the birthday, then get paid for it"
                    description={
                      <>
                        Build a price for any event straight from the client
                        you&apos;re already looking at.{" "}
                        <span
                          style={headingFont}
                          className="font-bold text-[#A5B4FC] underline decoration-2 decoration-[#A5B4FC] underline-offset-2"
                        >
                          Kindly
                        </span>{" "}
                        turns it into a proper document with your logo on it and
                        sends it for you.
                      </>
                    }
                    titleColor="text-white"
                    descColor="text-gray-300"
                    titleStyle={messageInvoiceTitleStyle}
                    descStyle={messageInvoiceDescStyle}
                    titleClassName="max-w-[320px]"
                    descClassName="max-w-[425px]"
                  />
                  <div className="flex flex-col gap-3 mt-6">
                    {[
                      { label: "Sent by email", state: "default" },
                      { label: "Viewed by Sarah", state: "default" },
                      { label: "Marked paid", state: "paid" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={bodyFont}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                          row.state === "paid"
                            ? "bg-[#059669] text-white"
                            : "bg-white text-[#111827]"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            row.state === "paid"
                              ? "bg-white/20 text-white"
                              : "bg-[#EEF0FF] text-[#2F3E9E]"
                          }`}
                        >
                          <PiCheck className="w-3 h-3" />
                        </span>
                        {row.label}
                      </div>
                    ))}
                  </div>
                </div>
                <img
                  src="/images/invoice.png"
                  alt="An invoice generated for a client event"
                  className="w-full h-auto rounded-xl self-center"
                />
              </div>
            </motion.div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8"
              >
                <CardHeading
                  icon={
                    <PiBellSimpleRinging className="w-5 h-5 text-[#2F3E9E]" />
                  }
                  iconBg="bg-[#EEF0FF] dark:bg-gray-800"
                  title="Reminders before the day"
                  description="Same day, a day, three days or a week ahead, your choice, per channel."
                  titleColor="text-[#111827] dark:text-gray-100"
                  descColor="text-[#6B7280] dark:text-gray-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 rounded-2xl bg-[#FCD34D] p-6 md:p-8"
              >
                <CardHeading
                  icon={<PiShieldCheck className="w-5 h-5 text-white" />}
                  iconBg="bg-[#161D49]"
                  title="Staff with the right access"
                  description="Invite your team members, set permissions, and see exactly who sent what."
                  titleColor="text-[#111827]"
                  descColor="text-[#3D3530]/80"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
