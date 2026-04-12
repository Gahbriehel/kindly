"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../components/FormElements/Input";
import { useState } from "react";
import { AuthLayout } from "../../components/UI/AuthLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { customToast } from "@/src/app/helpers/customToast";

interface Inputs {
  email: string;
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter Email"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);
    try {
      // Mocking reset link sent for now
      console.log("Reset password for:", data.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      customToast.success("Reset link sent to your email!");
    } catch (error) {
      console.log("Reset password error:", error);
      customToast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtext="Enter your email to receive a reset link."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      backButton
      footer={
        <p className="text-gray-400 text-sm">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#FF9B7A] hover:underline"
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
