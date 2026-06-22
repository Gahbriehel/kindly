"use client";

import { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { SwitchWrapper } from "@/src/components/FormElements/Switch";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { customToast } from "@/src/helpers/customToast";

export interface SecurityFormData {
  newPassword?: string;
  twoFactorAuthentication: boolean;
}

export function SecurityForm(): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SecurityFormData>({
    defaultValues: {
      newPassword: "",
      twoFactorAuthentication: false,
    },
  });

  const onSubmit = async (data: SecurityFormData) => {
    // Simulating API Save
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Security updated:", data);
    customToast.success("Security settings updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Security & Access
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Secure your account and authentication preferences
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
