"use client";

import { JSX, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useChangePasswordMutation } from "@/src/hooks/useAuthQuery";
import {
  PASSWORD_RULES_HINT,
  confirmPasswordSchema,
  newPasswordSchema,
} from "@/src/helpers/passwordRules";

const WRONG_CURRENT_PASSWORD = "Current password is incorrect";

export const securitySchema = yup.object({
  currentPassword: yup.string().required("Enter your current password"),
  newPassword: newPasswordSchema,
  confirmNewPassword: confirmPasswordSchema("newPassword"),
});

export type SecurityFormData = yup.InferType<typeof securitySchema>;

type PasswordField = keyof SecurityFormData;

export function SecurityForm(): JSX.Element {
  // Changing a password stays allowed on a read-only (expired) plan.
  const { mutate: changePassword, isPending } = useChangePasswordMutation();
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const { control, handleSubmit, reset, setError } = useForm<SecurityFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(securitySchema),
  });

  const toggleProps = (name: PasswordField) => ({
    type: visible[name] ? "text" : "password",
    password: true,
    showPassword: () => setVisible((v) => ({ ...v, [name]: true })),
    hidePassword: () => setVisible((v) => ({ ...v, [name]: false })),
  });

  const onSubmit = (data: SecurityFormData) => {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      },
      {
        onSuccess: () => reset(),
        onError: (error) => {
          const message = (error as AxiosError<{ message?: string }>).response
            ?.data?.message;
          if (message === WRONG_CURRENT_PASSWORD) {
            setError(
              "currentPassword",
              { message: WRONG_CURRENT_PASSWORD },
              { shouldFocus: true },
            );
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
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
            name="currentPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                {...toggleProps("currentPassword")}
                id="current-password"
                label="Current Password"
                required
                autoComplete="current-password"
                placeholder="Enter your current password"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Input
                  {...field}
                  {...toggleProps("newPassword")}
                  id="new-password"
                  label="New Password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter a new password"
                  error={fieldState.error?.message}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {PASSWORD_RULES_HINT}
                </p>
              </div>
            )}
          />

          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                {...toggleProps("confirmNewPassword")}
                id="confirm-password"
                label="Confirm New Password"
                required
                autoComplete="new-password"
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
            disabled={isPending}
            className="px-8 py-2.5 rounded-xl text-sm font-medium transition-all"
          />
        </div>
      </div>
    </form>
  );
}
