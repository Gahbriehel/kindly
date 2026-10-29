"use client";

import { JSX, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileView } from "@/src/components/Forms/ProfileView";
import { BusinessView } from "@/src/components/Forms/BusinessView";
import { InvoiceSettingsForm } from "@/src/components/Forms/InvoiceSettingsForm";
import { NotificationsForm } from "@/src/components/Forms/NotificationsForm";
import { SecurityForm } from "@/src/components/Forms/SecurityForm";
import { CategoryForm } from "@/src/components/Forms/CategoryForm";
import { AppearanceForm } from "@/src/components/Forms/AppearanceForm";
import { PROFILE_TABS, type ProfileTab } from "./tabs";

export default function ProfilePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  return (
    <div className="w-full h-full mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
          Profile & Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Manage your account preferences, security policies and template
          categories
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-4 md:mt-8 flex flex-col gap-6 md:gap-8 md:flex-row md:items-start">
        {/* Sidebar */}
        <aside className="w-[calc(100%+2rem)] -mx-4 sm:w-[calc(100%+3rem)] sm:-mx-6 md:w-64 md:mx-0 shrink-0 flex flex-row md:flex-col items-center md:items-stretch overflow-x-auto md:overflow-x-visible px-4 sm:px-6 md:px-0 md:pr-6 py-2 md:py-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sticky -top-4 sm:-top-6 md:top-2 md:self-start bg-gray-50/95 dark:bg-theme-surface/95 md:bg-transparent dark:md:bg-transparent backdrop-blur-xs md:backdrop-blur-none z-10">
          <div className="flex flex-row md:flex-col items-center md:items-stretch gap-1.5 md:gap-1 min-w-max mx-auto md:mx-0">
            {PROFILE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col md:flex-row items-center justify-center md:items-start md:justify-start gap-1.5 md:gap-3 shrink-0 md:shrink md:w-full py-2 px-3 md:p-3 rounded-xl transition-all text-center md:text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                    isActive
                      ? "bg-theme-primary/10 text-theme-primary"
                      : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon
                    className={`size-5 shrink-0 md:mt-0.5 ${isActive ? "text-theme-primary" : "text-gray-400"}`}
                  />
                  <div className="hidden md:block">
                    <p className="font-semibold text-sm">{tab.name}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isActive
                          ? "text-theme-primary/80"
                          : "text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      {tab.desc}
                    </p>
                  </div>
                  <span className="md:hidden text-xs font-semibold leading-none">
                    {tab.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-settings-tab"
                      className="absolute bottom-0 md:bottom-auto md:right-0 left-2 right-2 md:left-auto h-0.5 md:h-full md:w-0.5 bg-theme-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === "profile" && <ProfileView />}
              {activeTab === "business" && <BusinessView />}
              {activeTab === "invoices" && <InvoiceSettingsForm />}
              {activeTab === "notifications" && <NotificationsForm />}
              {activeTab === "security" && <SecurityForm />}
              {activeTab === "categories" && <CategoryForm />}
              {activeTab === "appearance" && <AppearanceForm />}
              {activeTab === "billing" && (
                <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs dark:border-slate-700/60 dark:bg-slate-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    Plan & Billing
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Manage your subscription tier and payment methods
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
