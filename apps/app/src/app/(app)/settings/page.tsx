"use client";

import { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsGear } from "react-icons/bs";
import { SwitchWrapper } from "@/src/components/FormElements/Switch";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";

interface FormData {
  emailNotifications: boolean;
  whatsAppNotifications: boolean;
  dailyReminders: boolean;
  newPassword?: string;
  twoFactorAuthentication: boolean;
}

export default function SettingsPage(): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      emailNotifications: false,
      whatsAppNotifications: false,
      dailyReminders: false,
      newPassword: "",
      twoFactorAuthentication: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Settings updated:", data);
  };

  return (
    <div className="w-full h-full max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary ring-1 ring-theme-primary/20">
          <BsGear className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <section className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10 transition-all hover:shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Notifications
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Configure how you receive alerts and reminders
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
        </section>

        <section className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10 transition-all hover:shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Security
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Manage your password and authentication methods
            </p>
          </div>

          <div className="grid gap-8 rounded-2xl bg-white dark:bg-slate-800/80 p-6 border border-gray-100 dark:border-slate-700/50">
            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="password"
                  label="Change Password"
                  type="password"
                  placeholder="Enter a new password"
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="h-px bg-gray-100 dark:bg-slate-700/50" />

            <Controller
              name="twoFactorAuthentication"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <SwitchWrapper
                  label="Two-Factor Authentication"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.twoFactorAuthentication}
                  className="flex items-center justify-between"
                />
              )}
            />
          </div>
        </section>

        <div className="flex justify-end mb-6 p-6">
          <BaseButton
            type="submit"
            color="primary"
            text="Save Changes"
            className="px-8 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all"
          />
        </div>
      </form>
    </div>
  );
}
