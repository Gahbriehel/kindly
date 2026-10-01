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
    businessName: yup.string().required("Enter Business name"),
    industry: yup.string().required("Enter Industry"),
    estimatedClientCount: yup
      .number()
      .typeError("Enter a valid number")
      .min(1, "Must be at least 1")
      .required("Enter estimated client count"),
    address: yup.string().required("Enter Address"),
    country: yup.string().required("Enter Country"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Enter Password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Enter Confirm Password"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpPayload>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      industry: "",
      estimatedClientCount: 1,
      address: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
  });

  async function onSubmit(data: ISignUpPayload) {
    try {
      const payload: ISignUpPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        businessName: data.businessName,
        industry: data.industry,
        estimatedClientCount: Number(data.estimatedClientCount) || 1,
        address: data.address,
        country: data.country,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      signupMutation.mutate(payload);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtext="Start managing your clients and events"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={signupMutation.isPending}
      backButton
      backHref="/"
      footer={
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-theme-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Controller
          name="businessName"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Business Name"
              placeholder="Acme Studio"
              type="text"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          name="industry"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Industry"
              placeholder="Photography / Events"
              type="text"
              error={fieldState.error?.message}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Address"
              placeholder="123 Studio Ave"
              type="text"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Country"
              placeholder="United States"
              type="text"
              error={fieldState.error?.message}
              required
            />
          )}
        />
      </div>

      <Controller
        name="estimatedClientCount"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Estimated Clients"
            placeholder="10"
            type="number"
            min={1}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm Password"
              type={showPassword}
              error={errors.confirmPassword?.message}
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
      </div>

      <p className="text-xs text-gray-500 mt-2">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="font-semibold text-theme-primary hover:underline"
        >
          terms of service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="font-semibold text-theme-primary hover:underline"
        >
          privacy policy
        </Link>
      </p>
    </AuthLayout>
  );
}
