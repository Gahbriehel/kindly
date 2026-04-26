"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../../components/FormElements/Input";
import { useState } from "react";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { ISignUpPayload } from "../../../models/auth";
import { useSignupMutation } from "../../../hooks/useAuthQuery";

export default function RegisterPage() {
  const signupMutation = useSignupMutation();
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );

  const schema = yup.object({
    firstName: yup.string().required("Enter First name"),
    lastName: yup.string().required("Enter Last name"),
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
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: ISignUpPayload) {
    try {
      const payload: ISignUpPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      signupMutation.mutate(payload);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtext="Start your journey with Kindly today."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={signupMutation.isPending}
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
        name="firstName"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="First Name"
            placeholder="John"
            type="text"
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="lastName"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Last Name"
            placeholder="Doe"
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
            placeholder="email@address.com"
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
