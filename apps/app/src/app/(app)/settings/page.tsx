"use client";

import { JSX, useState } from "react";
import { BsGear } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationsForm } from "@/src/components/Forms/NotificationsForm";
import { SecurityForm } from "@/src/components/Forms/SecurityForm";
import { CategoryForm } from "@/src/components/Forms/CategoryForm";
import { SETTINGS_TABS, type SettingsTab } from "./tabs";

export default function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>("notifications");

  return (
    <div className="w-full h-full mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary ring-1 ring-theme-primary/20">
          <BsGear className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your account preferences, security policies, and template
            categories
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 pr-0 md:pr-6 custom-scrollbar">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col md:flex-row items-center md:items-start gap-3 w-full p-3 rounded-xl transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                  isActive
                    ? "bg-theme-primary/10 text-theme-primary"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  className={`size-5 mt-0.5 shrink-0 ${isActive ? "text-theme-primary" : "text-gray-400"}`}
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
                <span className="md:hidden text-xs font-semibold">
                  {tab.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-settings-tab"
                    className="absolute bottom-0 md:bottom-auto md:right-0 left-0 md:left-auto h-0.5 md:h-full w-full md:w-0.5 bg-theme-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
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
              {activeTab === "notifications" && <NotificationsForm />}
              {activeTab === "security" && <SecurityForm />}
              {activeTab === "categories" && <CategoryForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
