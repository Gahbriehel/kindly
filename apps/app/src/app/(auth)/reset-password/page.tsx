"use client";

import * as yup from "yup";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { AxiosError } from "axios";
import { Input } from "../../../components/FormElements/Input";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { BaseButton } from "../../../components/UI/Buttons";
import { useResetPasswordMutation } from "@/src/hooks/useAuthQuery";
import {
  PASSWORD_RULES_HINT,
  confirmPasswordSchema,
  newPasswordSchema,
} from "@/src/helpers/passwordRules";
import type { IBaseResponse } from "@/src/models/base";

const INVALID_TOKEN_MESSAGE = "Reset token is invalid or has expired";

const schema = yup.object({
  newPassword: newPasswordSchema,
  confirmPassword: confirmPasswordSchema("newPassword"),
});

type Inputs = yup.InferType<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
  const searchParams = useSearchParams();
  // Captured once: the token is stripped from the URL right after mount, which
  // would otherwise make useSearchParams return null on the next render.
  const [token] = useState(() => searchParams.get("token"));

  useEffect(() => {
    if (!searchParams.has("token")) return;
    window.history.replaceState(null, "", window.location.pathname);
  }, [searchParams]);

  const resetPasswordMutation = useResetPasswordMutation();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { control, handleSubmit } = useForm<Inputs>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: yupResolver(schema),
  });

  const error = resetPasswordMutation.error as AxiosError<IBaseResponse> | null;
  const tokenRejected =
    error?.response?.status === 400 &&
    error.response.data?.message === INVALID_TOKEN_MESSAGE;

  if (!token) {
    return (
      <LinkProblem
        title="Link incomplete"
        message="This reset link is incomplete. Request a new one."
      />
    );
  }

  if (tokenRejected) {
    return (
      <LinkProblem
        title="Link expired"
        message="This link has expired or was already used. Reset links last 1 hour and work once."
      />
    );
  }

  function onSubmit(data: Inputs) {
    resetPasswordMutation.mutate({
      token: token as string,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtext="Pick something you haven't used here before."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={resetPasswordMutation.isPending}
      submitButtonText="Save new password"
      footer={<SignInFooter />}
    >
      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <Input
              {...field}
              id="newPassword"
              label="New password"
              placeholder="Enter new password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              error={fieldState.error?.message}
              password
              showPassword={() => setShowNew(true)}
              hidePassword={() => setShowNew(false)}
              required
            />
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {PASSWORD_RULES_HINT}
            </p>
          </div>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter new password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            error={fieldState.error?.message}
            password
            showPassword={() => setShowConfirm(true)}
            hidePassword={() => setShowConfirm(false)}
            required
          />
        )}
      />
    </AuthLayout>
  );
}

function LinkProblem({ title, message }: { title: string; message: string }) {
  return (
    <AuthLayout
      title={title}
      subtext="Let's get you a fresh reset link."
      loading={false}
      showSubmitButton={false}
      footer={<SignInFooter />}
    >
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
        <p className="text-sm text-orange-800 dark:text-orange-200">
          {message}
        </p>
      </div>
      <BaseButton
        type="link"
        href="/forgot-password"
        text="Request a new link"
        color="primary"
        className="w-full !h-14 font-bold rounded-2xl text-base"
      />
    </AuthLayout>
  );
}

function SignInFooter() {
  return (
    <p className="text-gray-500 dark:text-slate-400 text-sm">
      Remembered your password?{" "}
      <Link
        href="/login"
        className="font-semibold text-theme-primary hover:underline"
      >
        Sign in
      </Link>
    </p>
  );
}
