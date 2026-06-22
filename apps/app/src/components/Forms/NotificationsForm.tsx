"use client";

import { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { SwitchWrapper } from "@/src/components/FormElements/Switch";
import { BaseButton } from "@/src/components/UI/Buttons";
import { customToast } from "@/src/helpers/customToast";

export interface NotificationsFormData {
  emailNotifications: boolean;
  whatsAppNotifications: boolean;
  dailyReminders: boolean;
}

export function NotificationsForm(): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NotificationsFormData>({
    defaultValues: {
      emailNotifications: false,
      whatsAppNotifications: false,
      dailyReminders: false,
    },
  });

  const onSubmit = async (data: NotificationsFormData) => {
    // Simulating API Save
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Notifications updated:", data);
    customToast.success("Notification preferences updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Notifications & Alerts
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Configure how and where you receive alerts and reminders
          </p>
        </div>

        <div className="grid gap-6 rounded-2xl bg-white dark:bg-slate-800/80 p-6 border border-gray-100 dark:border-slate-700/50">
          <Controller
            name="emailNotifications"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <SwitchWrapper
                label="Email Notifications"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.emailNotifications}
                className="flex items-center justify-between"
              />
            )}
          />
          <div className="h-px bg-gray-100 dark:bg-slate-700/50" />
          <Controller
            name="whatsAppNotifications"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <SwitchWrapper
                label="WhatsApp Notifications"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.whatsAppNotifications}
                className="flex items-center justify-between"
              />
            )}
          />
          <div className="h-px bg-gray-100 dark:bg-slate-700/50" />
          <Controller
            name="dailyReminders"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <SwitchWrapper
                label="Daily Reminders"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.dailyReminders}
                className="flex items-center justify-between"
              />
            )}
          />
        </div>

        <div className="flex justify-end mt-6">
          <BaseButton
            type="submit"
            color="primary"
            text="Save Changes"
            loading={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all"
          />
        </div>
      </div>
    </form>
  );
}
