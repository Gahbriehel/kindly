"use client";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { Input } from "../../../components/FormElements/Input";
import { useState } from "react";
import { AuthLayout } from "../../../components/UI/AuthLayout";
import { useLoginMutation } from "@/src/hooks/useAuthQuery";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginPayload } from "../../../models/auth";

interface Inputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const loginMutation = useLoginMutation();
  const { user } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter Email"),
    password: yup.string().required("Enter Password"),
    rememberMe: yup.boolean(),
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const userObj = user as any;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userObj?.email ?? userObj?.username ?? "",
      password: "",
      rememberMe: false,
    },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs) {
    try {
      const payload: ILoginPayload = {
        username: data.email,
        password: data.password,
      };

      loginMutation.mutate({ ...payload });
    } catch (error) {
      console.log("Login error:", error);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtext="Please enter your details to sign in."
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loginMutation.isPending}
      footer={
        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#FF9B7A] hover:underline"
          >
            Sign up
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

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => {
              const { value, onChange, ...rest } = field;
              return (
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#FF9B7A] focus:ring-[#FF9B7A]"
                  {...rest}
                />
              );
            }}
          />
          Remember me
        </label>

        <Link
          href="/reset-password"
          className="font-semibold text-[#FF9B7A] hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  );
}
