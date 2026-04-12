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
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    name: yup.string().required("Enter Full Name"),
    email: yup.string().email("Invalid email").required("Enter Email"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Enter Password"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);
    try {
      // Mocking registration for now as the hook is not yet available
      console.log("Registration data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      customToast.success("Account created successfully!");
    } catch (error) {
      console.log("Registration error:", error);
      customToast.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtext="Start your journey with Kindly today."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      footer={
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
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
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Full Name"
            placeholder="Enter your name"
            type="text"
            error={fieldState.error?.message}
            required
          />
        )}
      />

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

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Password"
            type={showPassword}
            error={errors.password?.message}
            hidePassword={() => {
              setShowPassword("password");
            }}
            showPassword={() => {
              setShowPassword("text");
            }}
            password
            required
          />
        )}
      />

      <p className="text-xs text-gray-500 mt-2">
        By clicking continue, you agree to our terms of service and privacy
        policy.
      </p>
    </AuthLayout>
  );
}
