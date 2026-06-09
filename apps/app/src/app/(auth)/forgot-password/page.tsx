"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../../components/FormElements/Input";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "@/src/hooks/useAuthQuery";

interface Inputs {
  email: string;
}

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter Email"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs) {
    try {
      const payload = {
        email: data.email,
      };

      forgotPasswordMutation.mutate(payload);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtext="Enter your email to receive a reset link."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={forgotPasswordMutation.isPending}
      backButton
      footer={
        <p className="text-gray-400 text-sm">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-theme-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Email Address"
            placeholder="Enter mail address"
            type="email"
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
        <p className="text-sm text-orange-800 dark:text-orange-200">
          We will send a password recovery link to your inbox. Please check your
          spam folder if you do not receive it.
        </p>
      </div>
    </AuthLayout>
  );
}
