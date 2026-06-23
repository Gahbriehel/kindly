"use client";

import { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useChangePasswordMutation } from "@/src/hooks/useAuthQuery";

export const securitySchema = yup.object({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters"),
  confirmNewPassword: yup
    .string()
    .required("Confirm new password is required")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export interface SecurityFormData {
  newPassword: string;
  confirmNewPassword: string;
}

export function SecurityForm(): JSX.Element {
  const { mutate: changePassword, isPending } = useChangePasswordMutation();
  const { control, handleSubmit, reset } = useForm<SecurityFormData>({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(securitySchema),
  });

  const onSubmit = (data: SecurityFormData) => {
    changePassword(
      {
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      },
      { onSuccess: () => reset() },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Security &amp; Access
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

          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="confirm-password"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="h-px bg-gray-100 dark:bg-slate-700/50" />
        </div>

        <div className="flex justify-end mt-6">
          <BaseButton
            type="submit"
            color="primary"
            text="Save Changes"
            loading={isPending}
            className="px-8 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all"
          />
        </div>
      </div>
    </form>
  );
}
